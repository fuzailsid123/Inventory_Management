#include "storage.hpp"
#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Error: Expected 1 argument (id)" << std::endl;
        return 1;
    }

    int id_to_delete;
    try {
        id_to_delete = std::stoi(argv[1]);
    } catch (const std::exception& e) {
        std::cerr << "Error: Invalid ID" << std::endl;
        return 1;
    }

    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);

    auto new_end = std::remove_if(products.begin(), products.end(), 
        [id_to_delete](const Product& p) {
            return p.id == id_to_delete;
        });

    if (new_end == products.end()) {
        std::cerr << "Error: Product not found" << std::endl;
        return 1;
    }

    products.erase(new_end, products.end());

    if (save_data(products, PRODUCTS_DB)) {
        std::cout << "Success" << std::endl;
    } else {
        std::cerr << "Error: Could not save data after deletion" << std::endl;
        return 1;
    }

    return 0;
}