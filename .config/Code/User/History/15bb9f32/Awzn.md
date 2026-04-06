{
"title": "AxonRing Home Page",
"type": "page",
"version": "3.24.0",
"page_settings": {
"template": "elementor_canvas",
"background_background": "classic",
"background_color": "#0a0a0a",
"padding": {"unit":"px","top":"0","right":"0","bottom":"0","left":"0"},
"meta_description": "AxonRing - Premium smart rings for health monitoring and productivity. Shop high-quality titanium and ceramic smart wearables with NFC and ECG features.",
"meta_keywords": "smart ring, health tracker, productivity wearable, NFC ring, ECG monitoring, dropshipping smart ring, AxonRing"
},
"content": [
{
"id": "navbar",
"elType": "section",
"settings": {"structure": "10", "background_background": "classic", "background_color": "#0a0a0a", "padding": {"top": "20", "bottom": "20"}},
"elements": [
{
"id": "logo-column",
"elType": "column",
"settings": {"_column_size": 33},
"elements": [
{
"id": "logo",
"elType": "widget",
"widgetType": "image",
"settings": {
"image": {"url": "https://yourdomain.com/images/axonring-logo.png", "alt": "AxonRing logo - premium smart ring brand for professionals"},
"link_to": "home"
}
}
]
},
{
"id": "menu-column",
"elType": "column",
"settings": {"_column_size": 33},
"elements": [
{
"id": "menu",
"elType": "widget",
"widgetType": "wp-widget-nav_menu",
"settings": {"menu": "Main Menu", "align": "center"}
}
]
},
{
"id": "cart-column",
"elType": "column",
"settings": {"_column_size": 33},
"elements": [
{
"id": "cart",
"elType": "widget",
"widgetType": "woocommerce-menu_cart",
"settings": {"align": "right"}
}
]
}
]
},
{
"id": "hero",
"elType": "section",
"settings": {"height": "min-height", "custom_height": {"unit": "vh", "size": 100}, "background_background": "gradient", "background_gradient": [{"color": "#0a0a0a", "location": 0}, {"color": "#10b981", "location": 100}], "overlay_background": "classic", "overlay_image": {"url": "https://yourdomain.com/images/hero-ring.jpg", "alt": "AxonRing smart ring hero image - black titanium health tracker on finger"}},
"elements": [
{
"id": "hero-content",
"elType": "column",
"settings": {"_column_size": 100, "content_position": "center", "align": "center"},
"elements": [
{
"id": "hero-title",
"elType": "widget",
"widgetType": "heading",
"settings": {"title": "Empower Your Day with AxonRing", "typography_typography": "custom", "typography_font_size": {"size": 60}, "typography_font_weight": "bold", "typography_text_color": "#FFFFFF"}
},
{
"id": "hero-subtitle",
"elType": "widget",
"widgetType": "text-editor",
"settings": {"editor": "Seamless health monitoring and productivity tools in a premium smart ring.", "typography_text_color": "#10b981"}
},
{
"id": "hero-cta",
"elType": "widget",
"widgetType": "button",
"settings": {"text": "Shop Now", "link": {"url": "/shop"}, "background_color": "#10b981", "typography_text_color": "#FFFFFF"}
}
]
}
]
},
{
"id": "features",
"elType": "section",
"settings": {"background_background": "classic", "background_color": "#18181b", "padding": {"top": "50", "bottom": "50"}},
"elements": [
{
"id": "features-container",
"elType": "container",
"settings": {"flex_direction": "row"},
"elements": [
{
"id": "feature1",
"elType": "column",
"settings": {"_column_size": 33},
"elements": [
{
"id": "feature1-icon",
"elType": "widget",
"widgetType": "icon",
"settings": {"icon": "fa fa-heart-pulse"}
},
{
"id": "feature1-title",
"elType": "widget",
"widgetType": "heading",
"settings": {"title": "Health Tracking"}
},
{
"id": "feature1-desc",
"elType": "widget",
"widgetType": "text-editor",
"settings": {"editor": "Monitor HRV, SpO2, and more."}
}
]
},
// Repeat for 2 more features
{
"id": "feature2",
"elType": "column",
"settings": {"_column_size": 33},
"elements": [
{
"id": "feature2-icon",
"elType": "widget",
"widgetType": "icon",
"settings": {"icon": "fa fa-brain"}
},
{
"id": "feature2-title",
"elType": "widget",
"widgetType": "heading",
"settings": {"title": "Productivity Insights"}
},
{
"id": "feature2-desc",
"elType": "widget",
"widgetType": "text-editor",
"settings": {"editor": "Focus modes and alerts."}
}
]
},
{
"id": "feature3",
"elType": "column",
"settings": {"_column_size": 33},
"elements": [
{
"id": "feature3-icon",
"elType": "widget",
"widgetType": "icon",
"settings": {"icon": "fa fa-bolt"}
},
{
"id": "feature3-title",
"elType": "widget",
"widgetType": "heading",
"settings": {"title": "Durable Design"}
},
{
"id": "feature3-desc",
"elType": "widget",
"widgetType": "text-editor",
"settings": {"editor": "Titanium build, waterproof."}
}
]
}
]
}
]
},
{
"id": "products",
"elType": "section",
"settings": {"padding": {"top": "50", "bottom": "50"}},
"elements": [
{
"id": "products-title",
"elType": "widget",
"widgetType": "heading",
"settings": {"title": "Our Collection", "align": "center"}
},
{
"id": "products-grid",
"elType": "widget",
"widgetType": "woocommerce-products",
"settings": {"columns": 4, "rows": 4, "query_post_type": "product", "query_category": "smart-rings"}
}
]
},
// Add testimonials, CTA, footer sections similarly
{
"id": "footer",
"elType": "section",
"settings": {"background_background": "classic", "background_color": "#0a0a0a"},
"elements": [
{
"id": "footer-content",
"elType": "container",
"elements": [
// Footer widgets for links, social, copyright
{
"id": "copyright",
"elType": "widget",
"widgetType": "text-editor",
"settings": {"editor": "© 2026 AxonRing. All rights reserved.", "align": "center"}
}
]
}
]
}
]
}
{
"title": "AxonRing Shop Page",
"type": "page",
"version": "3.24.0",
"page_settings": {
"template": "elementor_canvas",
"meta_description": "Shop AxonRing smart rings - premium titanium and ceramic models for health, productivity, NFC. Free shipping on all orders.",
"meta_keywords": "buy smart ring, AxonRing shop, health tracker ring, NFC wearable"
},
"content": [
{
"id": "shop-hero",
"elType": "section",
"settings": {"height": "min-height", "custom_height": {"size": 50, "unit": "vh"}},
"elements": [
{
"id": "shop-title",
"elType": "widget",
"widgetType": "heading",
"settings": {"title": "Smart Rings Collection", "align": "center"}
}
]
},
{
"id": "shop-filters",
"elType": "section",
"elements": [
{
"id": "filters",
"elType": "widget",
"widgetType": "woocommerce-product-filter",
"settings": {"filter_by": "price, category, attribute"}
}
]
},
{
"id": "shop-grid",
"elType": "section",
"elements": [
{
"id": "products",
"elType": "widget",
"widgetType": "archive-products"
}
]
}
]
}
{
"title": "AxonRing Single Product Template",
"type": "single",
"version": "3.24.0",
"content": [
{
"id": "product-hero",
"elType": "section",
"settings": {"structure": "20"},
"elements": [
{
"id": "gallery-column",
"elType": "column",
"settings": {"_column_size": 50},
"elements": [
{
"id": "gallery",
"elType": "widget",
"widgetType": "woocommerce-product-images",
"settings": {"thumbnails_position": "bottom"}
}
]
},
{
"id": "summary-column",
"elType": "column",
"settings": {"_column_size": 50},
"elements": [
{
"id": "title",
"elType": "widget",
"widgetType": "woocommerce-product-title"
},
{
"id": "price",
"elType": "widget",
"widgetType": "woocommerce-product-price"
},
{
"id": "short-desc",
"elType": "widget",
"widgetType": "woocommerce-product-short-description"
},
{
"id": "add-to-cart",
"elType": "widget",
"widgetType": "woocommerce-product-add-to-cart"
}
]
}
]
},
{
"id": "tabs",
"elType": "section",
"elements": [
{
"id": "product-tabs",
"elType": "widget",
"widgetType": "woocommerce-product-data-tabs"
}
]
},
{
"id": "related",
"elType": "section",
"elements": [
{
"id": "related-products",
"elType": "widget",
"widgetType": "woocommerce-product-related"
}
]
}
]
}
