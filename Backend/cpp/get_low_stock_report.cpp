#include "storage.hpp"
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

int main() {
    vector<Product> products = load_data<Product>(PRODUCTS_DB);

    ProductMinHeap low_stock_heap;

    for (const auto& p : products) {
        low_stock_heap.push(p);
    }

    vector<Product> sorted_low_stock;
    while (!low_stock_heap.empty()) {
        sorted_low_stock.push_back(low_stock_heap.top());
        low_stock_heap.pop();
    }

    cout << vector_to_json(sorted_low_stock, product_to_json) << endl;
    
    return 0;
}