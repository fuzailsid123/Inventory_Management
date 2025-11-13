#include "storage.hpp"
#include <fstream>
#include <iostream>

// --- Template Function Definitions ---

template<typename T>
bool save_data(const std::vector<T>& data, const std::string& filename) {
    std::ofstream file(filename, std::ios::binary | std::ios::trunc);
    if (!file) {
        std::cerr << "Error: Cannot open file for writing: " << filename << std::endl;
        return false;
    }

    // Write the number of records
    size_t count = data.size();
    file.write(reinterpret_cast<const char*>(&count), sizeof(size_t));

    // Write each record
    file.write(reinterpret_cast<const char*>(data.data()), count * sizeof(T));

    file.close();
    return true;
}

template<typename T>
std::vector<T> load_data(const std::string& filename) {
    std::vector<T> data;
    std::ifstream file(filename, std::ios::binary);

    if (!file) {
        // File might not exist yet, which is fine.
        return data; 
    }

    // Read the number of records
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
int get_next_id(const std::vector<T>& vec) {
    if (vec.empty()) {
        return 1;
    }
    // Find the max ID
    int max_id = 0;
    for (const auto& item : vec) {
        if (item.id > max_id) {
            max_id = item.id;
        }
    }
    return max_id + 1;
}

// --- Explicit Template Instantiations ---
// This is necessary because the definitions are in a .cpp file.
// We must tell the compiler which types we will use.
template bool save_data<User>(const std::vector<User>&, const std::string&);
template std::vector<User> load_data<User>(const std::string&);
template int get_next_id<User>(const std::vector<User>&);

template bool save_data<Product>(const std::vector<Product>&, const std::string&);
template std::vector<Product> load_data<Product>(const std::string&);
template int get_next_id<Product>(const std::vector<Product>&);

template bool save_data<Order>(const std::vector<Order>&, const std::string&);
template std::vector<Order> load_data<Order>(const std::string&);
template int get_next_id<Order>(const std::vector<Order>&);