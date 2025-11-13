#include "storage.hpp"
#include <iostream>

int main() {
    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);

    // Print the entire vector as a JSON array
    std::cout << vector_to_json(products, product_to_json) << std::endl;

    return 0;
}