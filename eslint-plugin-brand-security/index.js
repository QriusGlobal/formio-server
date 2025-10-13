const brandKeywords = ['formio', 'form.io', 'uppy', 'form-io', 'formio.js', 'uppyjs', 'uppy.io'];

const productionBrandPatterns = brandKeywords.map(
  keyword => new RegExp(`\\b${keyword.replace('.', '\\.')}\\b`, 'gi')
);

const isLegitimateUse = (node, context) => {
  const ancestors = context.getAncestors();

  if (node.type === 'ImportDeclaration' || node.type === 'ImportSpecifier') {
    return true;
  }

  const parent = ancestors[ancestors.length - 1];
  if (parent && parent.type === 'ImportDeclaration') {
    return true;
  }

  const sourceCode = context.getSourceCode();
  const comments = sourceCode.getAllComments();
  const nodeStart = node.range[0];
  const nodeEnd = node.range[1];

  for (const comment of comments) {
    if (comment.range[0] <= nodeStart && comment.range[1] >= nodeEnd) {
      return true;
    }
  }

  if (node.key && node.key.type === 'Identifier' && node.key.name === 'name') {
    return true;
  }

  return false;
};

const hasBrandReference = value => {
  if (typeof value !== 'string') {
    return false;
  }

  return productionBrandPatterns.some(pattern => pattern.test(value));
};

module.exports = {
  rules: {
    'no-brand-references': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent accidental brand exposure in production code',
          category: 'Security',
          recommended: true
        },
        messages: {
          brandExposure:
            'Brand reference "{{brand}}" detected. Remove or use environment variable.',
          consoleWithBrand: 'Console statement contains brand reference. Remove before production.'
        },
        schema: []
      },
      create(context) {
        return {
          Literal(node) {
            if (isLegitimateUse(node, context)) {
              return;
            }

            const value = node.value || node.raw;
            if (hasBrandReference(value)) {
              const matches = brandKeywords.filter(brand =>
                new RegExp(`\\b${brand.replace('.', '\\.')}\\b`, 'gi').test(value)
              );

              context.report({
                node,
                messageId: 'brandExposure',
                data: {
                  brand: matches.join(', ')
                }
              });
            }
          },

          TemplateElement(node) {
            if (isLegitimateUse(node, context)) {
              return;
            }

            const value = node.value.raw || node.value.cooked;
            if (hasBrandReference(value)) {
              const matches = brandKeywords.filter(brand =>
                new RegExp(`\\b${brand.replace('.', '\\.')}\\b`, 'gi').test(value)
              );

              context.report({
                node,
                messageId: 'brandExposure',
                data: {
                  brand: matches.join(', ')
                }
              });
            }
          },

          CallExpression(node) {
            if (node.callee.type === 'MemberExpression' && node.callee.object.name === 'console') {
              const args = node.arguments;
              for (const arg of args) {
                if (arg.type === 'Literal' && hasBrandReference(arg.value)) {
                  context.report({
                    node,
                    messageId: 'consoleWithBrand'
                  });
                  break;
                }

                if (arg.type === 'TemplateLiteral') {
                  for (const element of arg.quasis) {
                    if (hasBrandReference(element.value.raw)) {
                      context.report({
                        node,
                        messageId: 'consoleWithBrand'
                      });
                      break;
                    }
                  }
                }
              }
            }
          }
        };
      }
    },

    'no-production-secrets': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent hardcoded secrets and credentials',
          category: 'Security',
          recommended: true
        },
        messages: {
          hardcodedSecret: 'Potential hardcoded secret detected: {{type}}',
          apiKeyExposed: 'API key or token detected in source code'
        },
        schema: []
      },
      create(context) {
        const secretPatterns = [
          {
            pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/gi,
            type: 'API Key'
          },
          {
            pattern: /(?:secret|password|passwd)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
            type: 'Secret/Password'
          },
          {
            pattern: /(?:token|auth[_-]?token)\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/gi,
            type: 'Auth Token'
          },
          { pattern: /(?:private[_-]?key)\s*[:=]\s*['"]-----BEGIN/gi, type: 'Private Key' },
          { pattern: /mongodb:\/\/[^'"]+:[^'"]+@/gi, type: 'Database Connection String' }
        ];

        return {
          Literal(node) {
            const value = node.value || node.raw;
            if (typeof value !== 'string') {
              return;
            }

            for (const { pattern, type } of secretPatterns) {
              if (pattern.test(value)) {
                context.report({
                  node,
                  messageId: 'hardcodedSecret',
                  data: { type }
                });
                break;
              }
            }
          },

          TemplateElement(node) {
            const value = node.value.raw || node.value.cooked;

            for (const { pattern, type } of secretPatterns) {
              if (pattern.test(value)) {
                context.report({
                  node,
                  messageId: 'hardcodedSecret',
                  data: { type }
                });
                break;
              }
            }
          }
        };
      }
    },

    'no-source-map-references': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent source map references in production',
          category: 'Security',
          recommended: true
        },
        messages: {
          sourceMapReference: 'Source map reference detected. Remove for production.'
        },
        schema: []
      },
      create(context) {
        return {
          Program(node) {
            const sourceCode = context.getSourceCode();
            const comments = sourceCode.getAllComments();

            for (const comment of comments) {
              if (/sourceMappingURL/i.test(comment.value)) {
                context.report({
                  node,
                  loc: comment.loc,
                  messageId: 'sourceMapReference'
                });
              }
            }
          }
        };
      }
    },

    'no-debug-artifacts': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent debug artifacts in production code',
          category: 'Best Practices',
          recommended: true
        },
        messages: {
          todoWithBrand: 'TODO/FIXME comment contains brand reference',
          debuggerStatement: 'Debugger statement found',
          consoleDebug: 'Console debug statement found'
        },
        schema: []
      },
      create(context) {
        return {
          Program(node) {
            const sourceCode = context.getSourceCode();
            const comments = sourceCode.getAllComments();

            for (const comment of comments) {
              const commentText = comment.value.toLowerCase();

              if (
                (commentText.includes('todo') || commentText.includes('fixme')) &&
                hasBrandReference(comment.value)
              ) {
                context.report({
                  node,
                  loc: comment.loc,
                  messageId: 'todoWithBrand'
                });
              }
            }
          },

          CallExpression(node) {
            if (
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'console' &&
              ['debug', 'trace', 'dir'].includes(node.callee.property.name)
            ) {
              if (process.env.NODE_ENV === 'production') {
                context.report({
                  node,
                  messageId: 'consoleDebug'
                });
              }
            }
          }
        };
      }
    }
  }
};
