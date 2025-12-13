from PIL import Image, ImageDraw, ImageFont
import os
import platform

# ================= Configuration =================
CARD_WIDTH = 800
CARD_HEIGHT = 500
BG_COLOR = (255, 255, 255)  # White background
BORDER_COLOR = (0, 0, 0)    # Black border
TEXT_COLOR = (0, 0, 0)      # Black text
LINE_COLOR = (0, 0, 0)      # Black lines

# Font Setup (Auto-detects common English fonts)
system = platform.system()
font_path = None

# Attempt to find a standard font based on OS
if system == "Windows":
    font_path = "arial.ttf"
elif system == "Darwin": # MacOS
    font_path = "/System/Library/Fonts/Helvetica.ttc"
elif system == "Linux":
    font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

try:
    # Load font if path exists, otherwise use default
    if font_path and os.path.exists(font_path):
        font_title = ImageFont.truetype(font_path, 28)
        font_bold = ImageFont.truetype(font_path, 20)
        font_text = ImageFont.truetype(font_path, 18)
    else:
        # Fallback for Windows if path isn't explicit but font is installed
        font_title = ImageFont.truetype("arial.ttf", 28)
        font_bold = ImageFont.truetype("arial.ttf", 20)
        font_text = ImageFont.truetype("arial.ttf", 18)
except IOError:
    print("Standard font not found. Using default bitmap font.")
    font_title = ImageFont.load_default()
    font_bold = ImageFont.load_default()
    font_text = ImageFont.load_default()

# ================= Drawing Functions =================

def draw_card_template(draw, title, class_id, class_type):
    """Draws the common border and header"""
    # Outer Border
    draw.rectangle([(10, 10), (CARD_WIDTH-10, CARD_HEIGHT-10)], outline=BORDER_COLOR, width=3)
    
    # Header
    draw.text((30, 30), f"Class Name: {title}", font=font_title, fill=TEXT_COLOR)
    draw.text((CARD_WIDTH - 250, 35), f"ID: {class_id}", font=font_bold, fill=TEXT_COLOR)
    draw.text((CARD_WIDTH - 250, 60), f"Type: {class_type}", font=font_text, fill=TEXT_COLOR)
    
    # Header Separator
    draw.line([(10, 90), (CARD_WIDTH-10, 90)], fill=LINE_COLOR, width=2)

def draw_front(filename, data):
    """Draws Front Side (Responsibilities & Collaborators)"""
    img = Image.new('RGB', (CARD_WIDTH, CARD_HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    draw_card_template(draw, data['name'], data['id'], data['type'])
    
    # Description & Use Cases
    y_offset = 110
    draw.text((30, y_offset), f"Description: {data['desc']}", font=font_text, fill=TEXT_COLOR)
    y_offset += 30
    draw.text((30, y_offset), f"Associated Use Cases: {data['use_cases']}", font=font_text, fill=TEXT_COLOR)
    
    # Separator
    y_offset += 40
    draw.line([(10, y_offset), (CARD_WIDTH-10, y_offset)], fill=LINE_COLOR, width=2)
    
    # Columns Headers
    col_header_y = y_offset + 10
    draw.text((30, col_header_y), "Responsibilities", font=font_bold, fill=TEXT_COLOR)
    draw.text((CARD_WIDTH/2 + 20, col_header_y), "Collaborators", font=font_bold, fill=TEXT_COLOR)
    
    # Line under headers
    y_content_start = col_header_y + 35
    draw.line([(10, y_content_start), (CARD_WIDTH-10, y_content_start)], fill=LINE_COLOR, width=1)
    
    # Vertical Separator
    draw.line([(CARD_WIDTH/2, y_offset), (CARD_WIDTH/2, CARD_HEIGHT-10)], fill=LINE_COLOR, width=2)
    
    # Content Rows
    current_y = y_content_start + 10
    for item in data['rows']:
        resp = item[0]
        collab = item[1]
        draw.text((30, current_y), resp, font=font_text, fill=TEXT_COLOR)
        draw.text((CARD_WIDTH/2 + 20, current_y), collab, font=font_text, fill=TEXT_COLOR)
        current_y += 30
        
    img.save(filename)
    print(f"Generated: {filename}")

def draw_back(filename, data):
    """Draws Back Side (Attributes & Relationships)"""
    img = Image.new('RGB', (CARD_WIDTH, CARD_HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    draw_card_template(draw, data['name'], data['id'], data['type'])
    
    # Back Label
    draw.text((CARD_WIDTH - 100, 15), "[BACK]", font=font_bold, fill=(100, 100, 100))

    y_offset = 110
    
    # Attributes Section
    draw.text((30, y_offset), "Attributes:", font=font_bold, fill=TEXT_COLOR)
    y_offset += 30
    for attr in data['attributes']:
        draw.text((50, y_offset), f"- {attr}", font=font_text, fill=TEXT_COLOR)
        y_offset += 25
        
    y_offset += 20
    draw.line([(10, y_offset), (CARD_WIDTH-10, y_offset)], fill=LINE_COLOR, width=1)
    y_offset += 20
    
    # Relationships Section
    draw.text((30, y_offset), "Relationships:", font=font_bold, fill=TEXT_COLOR)
    y_offset += 30
    
    rels = data['relationships']
    draw.text((50, y_offset), f"Generalization: {rels['gen']}", font=font_text, fill=TEXT_COLOR)
    y_offset += 25
    draw.text((50, y_offset), f"Aggregation: {rels['agg']}", font=font_text, fill=TEXT_COLOR)
    y_offset += 25
    draw.text((50, y_offset), f"Associations: {rels['assoc']}", font=font_text, fill=TEXT_COLOR)

    img.save(filename)
    print(f"Generated: {filename}")

# ================= English Data Definitions =================

# 1. Shopping Cart Data
cart_front_data = {
    'name': 'ShoppingCart',
    'id': '101',
    'type': 'Concrete, Domain',
    'desc': 'Container for storing items a customer intends to buy before checkout.',
    'use_cases': '3 (Add Item, View Cart, Checkout)',
    'rows': [
        ('1. Add coffee bean to cart', 'CoffeeBean'),
        ('2. Calculate total price', ''),
        ('3. Remove specific item', ''),
        ('4. Verify stock availability', 'InventoryManager'),
        ('5. Checkout / Create order', 'Order')
    ]
}

cart_back_data = {
    'name': 'ShoppingCart',
    'id': '101',
    'type': 'Concrete, Domain',
    'attributes': [
        'cartItems (List<Item>) - Selected items',
        'subTotal (double) - Current total price',
        'creationDate (DateTime) - Timestamp of creation'
    ],
    'relationships': {
        'gen': '(None)',
        'agg': 'CoffeeBean, CartItem',
        'assoc': 'Customer'
    }
}

# 2. Coffee Bean Data
bean_front_data = {
    'name': 'CoffeeBean',
    'id': '102',
    'type': 'Concrete, Domain',
    'desc': 'Represents a specific product including origin, roast, and price.',
    'use_cases': '2 (Browse Products, Manage Products)',
    'rows': [
        ('1. Provide product details', '(None)'),
        ('2. Update price', ''),
        ('3. Update stock level', ''),
        ('4. Validate availability', '')
    ]
}

bean_back_data = {
    'name': 'CoffeeBean',
    'id': '102',
    'type': 'Concrete, Domain',
    'attributes': [
        'name (string) - e.g., "Ethiopia Yirgacheffe"',
        'pricePerKg (double) - Unit price',
        'roastLevel (enum) - Light/Medium/Dark',
        'stockQuantity (int) - Available stock'
    ],
    'relationships': {
        'gen': 'Product',
        'agg': '(None)',
        'assoc': 'InventoryManager, ShoppingCart'
    }
}

# ================= Execution =================

if __name__ == "__main__":
    # Generate 4 images
    draw_front('crc_shopping_cart_front_en.png', cart_front_data)
    draw_back('crc_shopping_cart_back_en.png', cart_back_data)
    
    draw_front('crc_coffee_bean_front_en.png', bean_front_data)
    draw_back('crc_coffee_bean_back_en.png', bean_back_data)