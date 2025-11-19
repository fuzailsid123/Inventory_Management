#pragma once

#include "structs.hpp"
#include <vector>
#include <string>

using namespace std;

const string USERS_DB = "../db/users.db";
const string PRODUCTS_DB = "../db/products.db";
const string ORDERS_DB = "../db/orders.db";


/**
 * Saves a vector of structs to a binary file.
 * @tparam T The struct type (e.g., User, Product).
 * @param data The vector of data to save.
 * @param filename The file to save to.
 * @return true on success, false on failure.
 */
template<typename T>
bool save_data(const vector<T>& data, const string& filename);

/**
 * Loads a vector of structs from a binary file.
 * @tparam T The struct type (e.g., User, Product).
 * @param filename The file to load from.
 * @return A vector of the loaded data.
 */
template<typename T>
vector<T> load_data(const string& filename);

/**
 * Gets the next available ID for a new item.
 * @tparam T The struct type (must have an 'id' member).
 * @param vec The vector of existing items.
 * @return The next integer ID.
 */
template<typename T>
int get_next_id(const vector<T>& vec);