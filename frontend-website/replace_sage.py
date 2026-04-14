import os

def replace_colors(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.css', '.tsx', '.ts')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Only write if there's a match to avoid touching unnecessary files
                    if any(c in content for c in ['#E08CA3', '#e08ca3', '#D17A91', '#FBE4EA', 'rgba(224, 140, 163', '#fff5f7', '#ffebf0', '#fff0f4']):
                        # Primary
                        content = content.replace('#E08CA3', '#7B9B82')
                        content = content.replace('#e08ca3', '#7B9B82')
                        
                        # Hover
                        content = content.replace('#D17A91', '#617D67')
                        
                        # Accent Light
                        content = content.replace('#FBE4EA', '#ECF2EE')
                        
                        # Shadows RGB
                        content = content.replace('rgba(224, 140, 163,', 'rgba(123, 155, 130,')

                        # Gradients on the main page
                        content = content.replace('#fff5f7', '#f3f7f4')
                        content = content.replace('#ffebf0', '#e9f2eb')
                        content = content.replace('#fff0f4', '#f2f6f3')

                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Failed {filepath}: {e}")

replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/components')
replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/app')

print("All pink colors swapped to Sage Green palette!")
