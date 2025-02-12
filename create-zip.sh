#!/bin/bash

get_plugin_version() {
    grep "\$plugin->release" ./src/version.php | awk -F "=" '{gsub(/['"'"' ;]/, "", $2); print $2}'
}

create_zipfile() {
    local zip_name=$1
    local plugin_name=$2
    local plugin_version=$3

    zip_file="${zip_name}-${plugin_version}.zip"

    # Remove current zip file
    if [ -f "$zip_file" ]; then
        rm -f "$zip_file"
    fi

    # Create ZIP excluding unnecessary node files and folders
    zip -r "$zip_file" src/ \
        --exclude "src/react/.cache/*" \
        --exclude "src/react/node_modules/*" \
        --exclude "src/react/src/*" \
        --exclude "src/react/.babelrc" \
        --exclude "src/react/package.json" \
        --exclude "src/react/package-lock.json"

    # Rename folder inside the zip
    temp_zip="${zip_file}.tmp"
    unzip -q "$zip_file" -d temp_extract
    mv temp_extract/src temp_extract/"$plugin_name"
    (cd temp_extract && zip -rq "../$temp_zip" .)
    mv "$temp_zip" "$zip_file"
    rm -rf temp_extract
}

# Variables 
zip_name="mod_recitcahiertraces"
plugin_name="recitcahiertraces"
plugin_version=$(get_plugin_version)

# Function call
create_zipfile "$zip_name" "$plugin_name" "$plugin_version"