#include "storage.hpp"
#include <iostream>
#include <string>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cerr << "Error: Expected 1 argument (id)" << endl;
        return 1;
    }

    int id_to_delete;
    try {
        id_to_delete = stoi(argv[1]);
    } catch (const exception& e) {
        cerr << "Error: Invalid ID" << endl;
        return 1;
    }

    vector<Product> products = load_data<Product>(PRODUCTS_DB);

    auto new_end = remove_if(products.begin(), products.end(), 
        [id_to_delete](const Product& p) {
            return p.id == id_to_delete;
        });

    if (new_end == products.end()) {
        cerr << "Error: Product not found" << endl;
        return 1;
    }

    products.erase(new_end, products.end());

    if (save_data(products, PRODUCTS_DB)) {
        cout << "Success" << endl;
    } else {
        cerr << "Error: Could not save data after deletion" << endl;
        return 1;
    }

    return 0;
}