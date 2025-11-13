#include "storage.hpp"
#include <iostream>
#include <queue> // For priority_queue (Min-Heap)
#include <vector>

int main() {
    std::vector<Product> products = load_data<Product>(PRODUCTS_DB);

    // DSA: Use a Min-Heap (priority_queue) to find low-stock items.
    // We define the comparator in structs.hpp
    ProductMinHeap low_stock_heap;

    // Insert all products into the heap O(N log N)
    for (const auto& p : products) {
        low_stock_heap.push(p);
    }

    std::vector<Product> sorted_low_stock;
    while (!low_stock_heap.empty()) {
        sorted_low_stock.push_back(low_stock_heap.top());
        low_stock_heap.pop();
    }

    // Print as JSON
    std::cout << vector_to_json(sorted_low_stock, product_to_json) << std::endl;
    
    return 0;
}