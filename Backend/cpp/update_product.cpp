#include "storage.hpp"
#include <iostream>
#include <string>
#include<cstring>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 7) {
        cerr << "Error: Expected 6 arguments (id, sku, name, price, quantity, category)" << endl;
        return 1;
    }

    int id_to_update;
    try {
        id_to_update = stoi(argv[1]);
    } catch (const exception& e) {
        cerr << "Error: Invalid ID" << endl;
        return 1;
    }
    
    string sku = argv[2];
    string name = argv[3];
    double price = stod(argv[4]);
    int quantity = stoi(argv[5]);
    string category = argv[6];

    vector<Product> products = load_data<Product>(PRODUCTS_DB);
    Product* product_to_update = nullptr;

    for (auto& p : products) {
        if (p.id == id_to_update) {
            product_to_update = &p;
            break;
        }
    }

    if (product_to_update == nullptr) {
        cerr << "Error: Product not found" << endl;
        return 1;
    }

    if (!sku.empty()) strncpy(product_to_update->sku, sku.c_str(), 49);
    if (!name.empty()) strncpy(product_to_update->name, name.c_str(), 99);
    if (price != -1) product_to_update->price = price;
    if (quantity != -1) product_to_update->quantity = quantity;
    if (!category.empty()) strncpy(product_to_update->category, category.c_str(), 49);

    if (save_data(products, PRODUCTS_DB)) {
        cout << product_to_json(*product_to_update) << endl;
    } else {
        cerr << "Error: Could not save updated product data" << endl;
        return 1;
    }

    return 0;
}