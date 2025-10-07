#!/bin/bash
#
# Large Test File Generator
#
# Generates test files of various sizes for E2E upload testing.
# Files are created in the same directory as this script.
#
# Usage:
#   bash generate-files.sh [--all|--quick|--specific SIZE]
#
# Options:
#   --all      Generate all test files (10MB, 50MB, 100MB, 500MB)
#   --quick    Generate only small files (10MB, 50MB) - default
#   --specific Generate specific size file (e.g., --specific 25)
#   --clean    Remove all generated test files
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Function to format bytes to human readable
format_size() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$(( bytes / 1024 ))KB"
    elif [ $bytes -lt 1073741824 ]; then
        echo "$(( bytes / 1048576 ))MB"
    else
        echo "$(( bytes / 1073741824 ))GB"
    fi
}

# Function to generate binary test file
generate_binary_file() {
    local size_mb=$1
    local filename=$2
    local content_type=${3:-"random"}

    print_info "Generating ${size_mb}MB file: ${filename}..."

    if [ "$content_type" = "zeros" ]; then
        # Use dd with /dev/zero for faster generation
        dd if=/dev/zero of="$filename" bs=1M count=$size_mb 2>/dev/null
    else
        # Use /dev/urandom for random data
        dd if=/dev/urandom of="$filename" bs=1M count=$size_mb 2>/dev/null
    fi

    if [ -f "$filename" ]; then
        local actual_size=$(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null)
        print_success "Created ${filename} ($(format_size $actual_size))"
    else
        print_error "Failed to create ${filename}"
        return 1
    fi
}

# Function to generate realistic PDF file
generate_pdf_file() {
    local size_mb=$1
    local filename=$2

    print_info "Generating ${size_mb}MB PDF file: ${filename}..."

    # Create PDF header
    cat > "$filename" << 'EOF'
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Form.io Test PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
308
%%EOF
EOF

    # Calculate remaining size needed
    local current_size=$(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null)
    local target_size=$(( size_mb * 1024 * 1024 ))
    local padding_size=$(( target_size - current_size ))

    # Append random data to reach target size
    if [ $padding_size -gt 0 ]; then
        dd if=/dev/urandom bs=1024 count=$(( padding_size / 1024 )) >> "$filename" 2>/dev/null
    fi

    local actual_size=$(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null)
    print_success "Created ${filename} ($(format_size $actual_size))"
}

# Function to generate realistic image file
generate_image_file() {
    local size_kb=$1
    local filename=$2

    print_info "Generating ${size_kb}KB image file: ${filename}..."

    # Create minimal JPEG header
    printf '\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00' > "$filename"

    # Calculate remaining size
    local current_size=$(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null)
    local target_size=$(( size_kb * 1024 ))
    local padding_size=$(( target_size - current_size - 2 ))

    # Append random data
    if [ $padding_size -gt 0 ]; then
        dd if=/dev/urandom bs=1024 count=$(( padding_size / 1024 )) >> "$filename" 2>/dev/null
    fi

    # Add JPEG end marker
    printf '\xFF\xD9' >> "$filename"

    local actual_size=$(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null)
    print_success "Created ${filename} ($(format_size $actual_size))"
}

# Function to clean generated files
clean_files() {
    print_info "Cleaning generated test files..."

    local files=(
        "10mb.bin"
        "50mb.bin"
        "100mb.bin"
        "500mb.bin"
        "sample-resume.pdf"
        "profile-photo.jpg"
        "project1.pdf"
        "project2.pdf"
    )

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            print_success "Removed $file"
        fi
    done

    print_success "Cleanup complete"
}

# Function to generate quick test files
generate_quick() {
    print_info "Generating quick test files (10MB, 50MB)..."
    generate_binary_file 10 "10mb.bin" "random"
    generate_binary_file 50 "50mb.bin" "random"
    generate_pdf_file 10 "sample-resume.pdf"
    generate_image_file 5120 "profile-photo.jpg"
    print_success "Quick file generation complete"
}

# Function to generate all test files
generate_all() {
    print_info "Generating all test files (10MB, 50MB, 100MB, 500MB)..."
    generate_binary_file 10 "10mb.bin" "random"
    generate_binary_file 50 "50mb.bin" "random"
    generate_binary_file 100 "100mb.bin" "zeros"
    generate_binary_file 500 "500mb.bin" "zeros"
    generate_pdf_file 10 "sample-resume.pdf"
    generate_pdf_file 5 "project1.pdf"
    generate_pdf_file 8 "project2.pdf"
    generate_image_file 5120 "profile-photo.jpg"
    print_success "All file generation complete"
}

# Function to generate specific size
generate_specific() {
    local size=$1
    local filename="${size}mb.bin"
    generate_binary_file $size "$filename" "random"
}

# Main execution
case "${1:-}" in
    --all)
        generate_all
        ;;
    --quick)
        generate_quick
        ;;
    --specific)
        if [ -z "$2" ]; then
            print_error "Please specify size in MB (e.g., --specific 25)"
            exit 1
        fi
        generate_specific "$2"
        ;;
    --clean)
        clean_files
        ;;
    *)
        print_info "Usage: $0 [--all|--quick|--specific SIZE|--clean]"
        print_info ""
        print_info "Options:"
        print_info "  --all      Generate all test files (10MB, 50MB, 100MB, 500MB)"
        print_info "  --quick    Generate only small files (10MB, 50MB) - default"
        print_info "  --specific Generate specific size file (e.g., --specific 25)"
        print_info "  --clean    Remove all generated test files"
        print_info ""
        print_info "Running quick generation by default..."
        generate_quick
        ;;
esac

exit 0
