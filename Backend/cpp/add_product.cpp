#include "storage.hpp"
#include <iostream>
#include <string>
#include <unordered_map>
#include <cstring>

int main(int argc, char* argv[]) {
    if (argc != 6) {
        std::cerr << "Error: Expected 5 arguments (sku, name, price, quantity, category)" << std::endl;
        return 1;
    }

    std::string sku = argv[1];
    std::string name = argv[2];
    double price;
    int quantity;
    std::string category = argv[5];

    try {
        price = std::stod(argv[3]);
        quantity = std::stoi(argv[4]);
    } catch (const std::exception& e) {
        std::cerr << "Error: Invalid price or quantity" << std::endl;
        return 1;
    }

    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);

    std::unordered_map<std::string, bool> sku_map;
    for(const auto& p : products) {
        sku_map[p.sku] = true;
    }

    if (sku_map.count(sku)) {
        std::cerr << "Error: SKU already exists" << std::endl;
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
        std::cout << product_to_json(new_product) << std::endl;
    } else {
        std::cerr << "Error: Could not save product data" << std::endl;
        return 1;
    }

    return 0;
}