#include "storage.hpp"
#include <iostream>

int main() {
    std::vector<Order> orders = load_data<Order>(ORDERS_DB);

    // Print the entire vector as a JSON array
    std::cout << vector_to_json(orders, order_to_json) << std::endl;

    return 0;
}