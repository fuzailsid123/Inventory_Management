#include "storage.hpp"
#include <iostream>

using namespace std;

int main() {
    vector<Order> orders = load_data<Order>(ORDERS_DB);

    cout << vector_to_json(orders, order_to_json) << endl;

    return 0;
}