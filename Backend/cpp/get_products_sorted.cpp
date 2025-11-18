#include "storage.hpp"
#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cerr << "Error: Expected 2 arguments (sortBy, sortOrder)" << endl;
        return 1;
    }

    string by = argv[1];
    string order = argv[2];

    vector<Product> products = load_data<Product>(PRODUCTS_DB);

    if (by == "name") {
        if (order == "asc") sort(products.begin(), products.end(), compareProductNameASC);
        else sort(products.begin(), products.end(), compareProductNameDESC);
    } else if (by == "price") {
        if (order == "asc") sort(products.begin(), products.end(), compareProductPriceASC);
        else sort(products.begin(), products.end(), compareProductPriceDESC);
    } else if (by == "quantity") {
        if (order == "asc") sort(products.begin(), products.end(), compareProductQtyASC);
        else sort(products.begin(), products.end(), compareProductQtyDESC);
    } else {
        sort(products.begin(), products.end(), compareProductNameASC);
    }

    cout << vector_to_json(products, product_to_json) << endl;

    return 0;
}