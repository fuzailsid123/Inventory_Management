#include "storage.hpp"
#include <iostream>

int main() {
    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);

    std::cout << vector_to_json(products, product_to_json) << std::endl;

    return 0;
}