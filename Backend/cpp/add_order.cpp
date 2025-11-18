#include "storage.hpp"
#include <iostream>
#include <string>
#include <unordered_map>
#include <cstring>

using namespace std;

void parse_items_json(const string& json_str, vector<OrderItem>& items) {
    string s = json_str;
    s.erase(remove(s.begin(), s.end(), ' '), s.end());
    
    size_t pos = 0;
    while((pos = s.find("{\"productId\":", pos)) != string::npos) {
        OrderItem item;
        
        size_t id_start = pos + 13;
        size_t id_end = s.find(",\"quantity\":", id_start);
        item.productId = stoi(s.substr(id_start, id_end - id_start));
        
        size_t qty_start = id_end + 12;
        size_t qty_end = s.find("}", qty_start);
        item.quantity = stoi(s.substr(qty_start, qty_end - qty_start));
        
        items.push_back(item);
        pos = qty_end;
    }
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cerr << "Error: Expected 2 arguments (customerName, itemsJSON)" << endl;
        return 1;
    }

    string customerName = argv[1];
    string itemsJson = argv[2];
    vector<OrderItem> parsedItems;

    try {
        parse_items_json(itemsJson, parsedItems);
    } catch (const exception& e) {
        cerr << "Error: Failed to parse items JSON" << endl;
        return 1;
    }

    if (parsedItems.empty()) {
        cerr << "Error: No items in order" << endl;
        return 1;
    }

    vector<Product> products = load_data<Product>(PRODUCTS_DB);
    vector<Order> orders = load_data<Order>(ORDERS_DB);

    unordered_map<int, Product*> product_map;
    for (auto& p : products) {
        product_map[p.id] = &p;
    }

    Order new_order;
    new_order.id = get_next_id(orders);
    strncpy(new_order.customerName, customerName.c_str(), 99);
    new_order.itemCount = 0;
    new_order.totalValue = 0.0;

    for (const auto& item : parsedItems) {
        if (product_map.count(item.productId) == 0) {
            cerr << "Error: Product with ID " << item.productId << " not found" << endl;
            return 1;
        }
        Product* p = product_map[item.productId];
        if (p->quantity < item.quantity) {
            cerr << "Error: Insufficient stock for product " << p->name << ". Have " << p->quantity << ", need " << item.quantity << endl;
            return 1;
        }
    }

    for (const auto& item : parsedItems) {
        Product* p = product_map[item.productId];
        p->quantity -= item.quantity;

        OrderItem order_item;
        order_item.productId = item.productId;
        order_item.quantity = item.quantity;
        order_item.pricePerItem = p->price;
        
        new_order.items[new_order.itemCount++] = order_item;
        new_order.totalValue += (item.quantity * p->price);
    }

    orders.push_back(new_order);

    if (save_data(products, PRODUCTS_DB) && save_data(orders, ORDERS_DB)) {
        cout << order_to_json(new_order) << endl;
    } else {
        cerr << "Error: Failed to save order or update products" << endl;
        return 1;
    }

    return 0;
}