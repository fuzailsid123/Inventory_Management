#include "storage.hpp"
#include <iostream>
#include <string>
#include<cstring>

int main(int argc, char* argv[]) {
    if (argc != 7) {
        std::cerr << "Error: Expected 6 arguments (id, sku, name, price, quantity, category)" << std::endl;
        return 1;
    }

    int id_to_update;
    try {
        id_to_update = std::stoi(argv[1]);
    } catch (const std::exception& e) {
        std::cerr << "Error: Invalid ID" << std::endl;
        return 1;
    }
    
    std::string sku = argv[2];
    std::string name = argv[3];
    double price = std::stod(argv[4]);
    int quantity = std::stoi(argv[5]);
    std::string category = argv[6];

    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);
    Product* product_to_update = nullptr;

    for (auto& p : products) {
        if (p.id == id_to_update) {
            product_to_update = &p;
            break;
        }
    }

    if (product_to_update == nullptr) {
        std::cerr << "Error: Product not found" << std::endl;
        return 1;
    }

    if (!sku.empty()) strncpy(product_to_update->sku, sku.c_str(), 49);
    if (!name.empty()) strncpy(product_to_update->name, name.c_str(), 99);
    if (price != -1) product_to_update->price = price;
    if (quantity != -1) product_to_update->quantity = quantity;
    if (!category.empty()) strncpy(product_to_update->category, category.c_str(), 49);

    if (save_data(products, PRODUCTS_DB)) {
        std::cout << product_to_json(*product_to_update) << std::endl;
    } else {
        std::cerr << "Error: Could not save updated product data" << std::endl;
        return 1;
    }

    return 0;
}