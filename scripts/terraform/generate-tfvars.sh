#!/usr/bin/env bash
set -e

fake_jq_get_value_from_json() {
  local json_file="$1"
  local key="$2"
  local default_value="$3"

  if command -v jq &> /dev/null; then
    jq -r ".$key" "$json_file"
  else
    IFS='.' read -r parent child <<< "$key"

    if [ -z "$child" ]; then
      value=$(awk -v parent="$parent" '
        $0 ~ "\"" parent "\"[[:space:]]*:" {
          sub("^[^:]*:[[:space:]]*", "", $0)
          gsub(/,$/, "", $0)
          gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
          print $0
          exit
        }
      ' "$json_file")
    else
      value=$(awk -v parent="$parent" -v child="$child" '
        $0 ~ "\"" parent "\"[[:space:]]*:[[:space:]]*\\{" {in_parent=1; next}
        in_parent && $0 ~ "\"" child "\"[[:space:]]*:" {
          sub("^[^:]*:[[:space:]]*", "", $0)
          gsub(/,$/, "", $0)
          gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
          print $0
          exit
        }
        in_parent && $0 ~ "}" {in_parent=0}
      ' "$json_file")
    fi

    value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
    echo "${value:-$default_value}"
  fi
}

generate_tfvars() {
  local project_dir="$(realpath "$1")"
  local tfvars_file="$(realpath "$2")"
  local default_github_repository_url="$3"

  found_projects=($(find "$project_dir" -mindepth 1 -maxdepth 1 -type d -print0 | while IFS= read -r -d '' dir; do
    echo "$dir"
  done))

  echo "projects = {" > "$tfvars_file"

  for project in "${found_projects[@]}"; do
    if [ ! -f "$project/package.json" ]; then
      echo "Skipping $project because it doesn't have a package.json file."
      continue
    fi

    echo "Processing $project"

    project_name=$(fake_jq_get_value_from_json "$project/package.json" "name")
    repository_url=$(fake_jq_get_value_from_json "$project/package.json" "repository.url" "")
    environments=$(fake_jq_get_value_from_json "$project/package.json" "config.environments" "[\"development\"]")
    cloud_provider=$(fake_jq_get_value_from_json "$project/package.json" "config.cloud_provider" "")
    tags=$(fake_jq_get_value_from_json "$project/package.json" "config.tags" "[]")
    database_type=$(fake_jq_get_value_from_json "$project/package.json" "config.database_type" "none")

    # Add quotes around the project name key to match your formatting
    cat >> "$tfvars_file" <<EOF
  "$project_name" = {
    name           = "$project_name"
    environments   = $environments
    tags           = $tags
    database_type  = "$database_type"
    env_vars       = {}
    cloud_provider = "$cloud_provider"
  }
EOF

  done

  # Close projects block and add github_repository_url
  cat >> "$tfvars_file" <<EOF
}

github_repository_url = "$default_github_repository_url"
EOF

  echo "Generated new tfvars file: $tfvars_file"
}

generate_tfvars "./projects" "./iac/projects/terraform.tfvars" "https://github.com/gm112/cruxt"
