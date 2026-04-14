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
                    if any(c in content for c in ['#768FEC', '#768fec', '#5A72DE', '#B3C6F1', 'rgba(118, 143, 236', '#f0f4ff', '#e6efff', '#f4f7ff']):
                        # Primary
                        content = content.replace('#768FEC', '#E08CA3')
                        content = content.replace('#768fec', '#E08CA3')
                        
                        # Hover
                        content = content.replace('#5A72DE', '#D17A91')
                        
                        # Accent Light
                        content = content.replace('#B3C6F1', '#FBE4EA')
                        
                        # Shadows RGB
                        content = content.replace('rgba(118, 143, 236,', 'rgba(224, 140, 163,')

                        # Gradients on the main page
                        content = content.replace('#f0f4ff', '#fff5f7')
                        content = content.replace('#e6efff', '#ffebf0')
                        content = content.replace('#f4f7ff', '#fff0f4')

                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Failed {filepath}: {e}")

replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/components')
replace_colors('/Users/notferuz/Desktop/hessa-main/frontend-website/app')

print("All lavender colors swapped to gentle pink palette!")
