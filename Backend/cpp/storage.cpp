#include "storage.hpp"
#include <fstream>
#include <iostream>

using namespace std;

template<typename T>
bool save_data(const vector<T>& data, const string& filename) {
    ofstream file(filename, ios::binary | ios::trunc);
    if (!file) {
        cerr << "Error: Cannot open file for writing: " << filename << endl;
        return false;
    }

    size_t count = data.size();
    file.write(reinterpret_cast<const char*>(&count), sizeof(size_t));

    file.write(reinterpret_cast<const char*>(data.data()), count * sizeof(T));

    file.close();
    return true;
}

template<typename T>
vector<T> load_data(const string& filename) {
    vector<T> data;
    ifstream file(filename, ios::binary);

    if (!file) {
        return data; 
    }

    size_t count = 0;
    file.read(reinterpret_cast<char*>(&count), sizeof(size_t));

    if (count > 0) {
        data.resize(count);
        file.read(reinterpret_cast<char*>(data.data()), count * sizeof(T));
    }

    file.close();
    return data;
}

template<typename T>
int get_next_id(const vector<T>& vec) {
    if (vec.empty()) {
        return 1;
    }
    int max_id = 0;
    for (const auto& item : vec) {
        if (item.id > max_id) {
            max_id = item.id;
        }
    }
    return max_id + 1;
}

template bool save_data<User>(const vector<User>&, const string&);
template vector<User> load_data<User>(const string&);
template int get_next_id<User>(const vector<User>&);

template bool save_data<Product>(const vector<Product>&, const string&);
template vector<Product> load_data<Product>(const string&);
template int get_next_id<Product>(const vector<Product>&);

template bool save_data<Order>(const vector<Order>&, const string&);
template vector<Order> load_data<Order>(const string&);
template int get_next_id<Order>(const vector<Order>&);