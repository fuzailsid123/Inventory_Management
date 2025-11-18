#include "storage.hpp"
#include <iostream>
#include <string>
#include <unordered_map>
#include <cstring>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 6) {
        cerr << "Error: Expected 5 arguments (sku, name, price, quantity, category)" << endl;
        return 1;
    }

    string sku = argv[1];
    string name = argv[2];
    double price;
    int quantity;
    string category = argv[5];

    try {
        price = stod(argv[3]);
        quantity = stoi(argv[4]);
    } catch (const exception& e) {
        cerr << "Error: Invalid price or quantity" << std::endl;
        return 1;
    }

    vector<Product> products = load_data<Product>(PRODUCTS_DB);

    unordered_map<string, bool> sku_map;
    for(const auto& p : products) {
        sku_map[p.sku] = true;
    }

    if (sku_map.count(sku)) {
        cerr << "Error: SKU already exists" << endl;
        return 1;
    }

    Product new_product;
    new_product.id = get_next_id(products);
    strncpy(new_product.sku, sku.c_str(), 49);
    strncpy(new_product.name, name.c_str(), 99);
    new_product.price = price;
    new_product.quantity = quantity;
    strncpy(new_product.category, category.c_str(), 49);

    products.push_back(new_product);

    if (save_data(products, PRODUCTS_DB)) {
        cout << product_to_json(new_product) << endl;
    } else {
        cerr << "Error: Could not save product data" << endl;
        return 1;
    }

    return 0;
}