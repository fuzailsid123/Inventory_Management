#include "storage.hpp"
#include <iostream>
#include <string>
#include <algorithm>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Error: Expected 2 arguments (sortBy, sortOrder)" << std::endl;
        return 1;
    }

    std::string by = argv[1];
    std::string order = argv[2];

    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);

    if (by == "name") {
        if (order == "asc") std::sort(products.begin(), products.end(), compareProductNameASC);
        else std::sort(products.begin(), products.end(), compareProductNameDESC);
    } else if (by == "price") {
        if (order == "asc") std::sort(products.begin(), products.end(), compareProductPriceASC);
        else std::sort(products.begin(), products.end(), compareProductPriceDESC);
    } else if (by == "quantity") {
        if (order == "asc") std::sort(products.begin(), products.end(), compareProductQtyASC);
        else std::sort(products.begin(), products.end(), compareProductQtyDESC);
    } else {
        std::sort(products.begin(), products.end(), compareProductNameASC);
    }

    std::cout << vector_to_json(products, product_to_json) << std::endl;

    return 0;
}