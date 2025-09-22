#!/usr/bin/env bash
set -e

TSCONFIG="tsconfig.json"

# Generate new references array without trailing comma
refs=$(find ./{projects,layers,modules} -mindepth 1 -maxdepth 1 -type d -print0 | while IFS= read -r -d '' dir; do
  echo "{ \"path\": \"$dir\" }"
done)

# Format new tsconfig content with updated references
new_tsconfig=$(awk -v newrefs="$refs" '
  /"references"/ {
    print "  \"references\": ["
    n = split(newrefs, arr, "\n")
    for (i=1; i<=n; i++) {
      print "    " arr[i] (i<n ? "," : "")
    }
    print "  ]"
    skip=1
    next
  }
  skip && /]/ {skip=0; next}
  !skip {print}
' "$TSCONFIG")

# Read raw existing tsconfig content
current_tsconfig=$(cat "$TSCONFIG")

# Compare raw strings; exit if identical
if [[ "$new_tsconfig" == "$current_tsconfig" ]]; then
  echo "References are up to date. No changes made."
  exit 0
fi

# Update tsconfig.json in-place
echo "$new_tsconfig" > "$TSCONFIG"
echo "Updated references in $TSCONFIG"
