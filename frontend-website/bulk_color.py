import os
import glob

def replace_colors(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.css', '.tsx', '.ts')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    if '#497a9b' in content or '#497A9B' in content:
                        content = content.replace('#497a9b', '#768FEC')
                        content = content.replace('#497A9B', '#768FEC')
                        # Also replace the old #3a627c (darker hover) with new hover #5A72DE if present
                        content = content.replace('#3a627c', '#5A72DE')
                        content = content.replace('#3A627C', '#5A72DE')
                        # Also replace rgb alpha string if any
                        content = content.replace('rgba(73, 122, 155,', 'rgba(118, 143, 236,')
                        
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Failed {filepath}: {e}")

replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/components')
replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/app')

print("All dark teal colors swapped to new gentle purple/blue palette!")
