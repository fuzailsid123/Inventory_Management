#include "storage.hpp"
#include <iostream>
#include <string>
#include <unordered_map>
#include <cstring>
// We need a C++ JSON parser. This is a problem for the "no external files" rule.
// The reference project doesn't pass complex data like JSON.
//
// WORKAROUND: The Node.js controller will pass the JSON as a string.
// We have to parse it manually. This is very brittle.
// A better way is to change the API, but we follow the user's `Inventory(1)` frontend.
//
// Let's use a minimal parser for: [{"productId":1,"quantity":2},...]
// This is too complex for this context.
//
// --- NEW PLAN for add_order ---
// The Node.js controller will pass: customerName, itemsJSON
// The C++ app *must* parse this. I will assume a very simple JSON structure.
// Let's use a minimal JSON parser.
// ... This is still too complex.
//
// --- FINAL PLAN for add_order ---
// The reference project passes simple args. We must do the same.
// The `Inventory(1)` frontend sends a complex JSON. This is a conflict.
// I *must* follow the reference project's flow.
// This means the C++ executable *cannot* parse JSON easily.
//
// Let's just assume the itemsJSON string is passed and try to parse it.
// This is a minimal, brittle parser.
void parse_items_json(const std::string& json_str, std::vector<OrderItem>& items) {
    // Brittle parser for [{"productId":ID,"quantity":QTY},...]
    std::string s = json_str;
    s.erase(std::remove(s.begin(), s.end(), ' '), s.end()); // remove spaces
    
    size_t pos = 0;
    while((pos = s.find("{\"productId\":", pos)) != std::string::npos) {
        OrderItem item;
        
        // find productId
        size_t id_start = pos + 13;
        size_t id_end = s.find(",\"quantity\":", id_start);
        item.productId = std::stoi(s.substr(id_start, id_end - id_start));
        
        // find quantity
        size_t qty_start = id_end + 12;
        size_t qty_end = s.find("}", qty_start);
        item.quantity = std::stoi(s.substr(qty_start, qty_end - qty_start));
        
        items.push_back(item);
        pos = qty_end;
    }
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Error: Expected 2 arguments (customerName, itemsJSON)" << std::endl;
        return 1;
    }

    std::string customerName = argv[1];
    std::string itemsJson = argv[2];
    std::vector<OrderItem> parsedItems;

    try {
        parse_items_json(itemsJson, parsedItems);
    } catch (const std::exception& e) {
        std::cerr << "Error: Failed to parse items JSON" << std::endl;
        return 1;
    }

    if (parsedItems.empty()) {
        std::cerr << "Error: No items in order" << std::endl;
        return 1;
    }

    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);
    std::vector<Order> orders = load_data<Order>(ORDERS_DB);

    // DSA: Use a Hash Table for O(1) average lookup of products
    std::unordered_map<int, Product*> product_map;
    for (auto& p : products) {
        product_map[p.id] = &p;
    }

    Order new_order;
    new_order.id = get_next_id(orders);
    strncpy(new_order.customerName, customerName.c_str(), 99);
    new_order.itemCount = 0;
    new_order.totalValue = 0.0;

    // --- Transaction Logic (Check stock first) ---
    for (const auto& item : parsedItems) {
        if (product_map.count(item.productId) == 0) {
            std::cerr << "Error: Product with ID " << item.productId << " not found" << std::endl;
            return 1;
        }
        Product* p = product_map[item.productId];
        if (p->quantity < item.quantity) {
            std::cerr << "Error: Insufficient stock for product " << p->name << ". Have " << p->quantity << ", need " << item.quantity << std::endl;
            return 1;
        }
    }

    // --- Commit Transaction (Update stock and create order) ---
    for (const auto& item : parsedItems) {
        Product* p = product_map[item.productId];
        p->quantity -= item.quantity; // Decrease stock

        OrderItem order_item;
        order_item.productId = item.productId;
        order_item.quantity = item.quantity;
        order_item.pricePerItem = p->price;
        
        new_order.items[new_order.itemCount++] = order_item;
        new_order.totalValue += (item.quantity * p->price);
    }

    orders.push_back(new_order);

    // Save both updated products and new order
    if (save_data(products, PRODUCTS_DB) && save_data(orders, ORDERS_DB)) {
        std::cout << order_to_json(new_order) << std::endl;
    } else {
        std::cerr << "Error: Failed to save order or update products" << std::endl;
        return 1;
    }

    return 0;
}