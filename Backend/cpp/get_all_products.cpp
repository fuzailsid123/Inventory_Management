#include "storage.hpp"
#include <iostream>

using namespace std;

int main() {
    vector<Product> products = load_data<Product>(PRODUCTS_DB);

    cout << vector_to_json(products, product_to_json) << endl;

    return 0;
}