#pragma once

#include <string>
#include <vector>
#include <fstream>
#include <iostream>
#include <sstream>
#include <algorithm>
#include <queue>
#include <unordered_map>
#include <functional>

inline unsigned long basic_hash(const std::string& str) {
    return std::hash<std::string>{}(str);
}


struct User {
    int id;
    char email[100];
    unsigned long passwordHash; // Store hash, not plain text
    char name[100];

    User() : id(0), passwordHash(0) {
        std::fill(email, email + 100, '\0');
        std::fill(name, name + 100, '\0');
    }
};

struct Product {
    int id;
    char sku[50]; // Stock Keeping Unit
    char name[100];
    double price;
    int quantity;
    char category[50];

    Product() : id(0), price(0.0), quantity(0) {
        std::fill(sku, sku + 50, '\0');
        std::fill(name, name + 100, '\0');
        std::fill(category, category + 50, '\0');
    }
};

struct OrderItem {
    int productId;
    int quantity;
    double pricePerItem; // Price at the time of order

    OrderItem() : productId(0), quantity(0), pricePerItem(0.0) {}
};

struct Order {
    int id;
    char customerName[100];
    OrderItem items[20]; // Max 20 items per order
    int itemCount;
    double totalValue;

    Order() : id(0), itemCount(0), totalValue(0.0) {
        std::fill(customerName, customerName + 100, '\0');
    }
};

inline std::string escape_json(const std::string& s) {
    std::stringstream ss;
    for (char c : s) {
        switch (c) {
            case '"': ss << "\\\""; break;
            case '\\': ss << "\\\\"; break;
            case '\b': ss << "\\b"; break;
            case '\f': ss << "\\f"; break;
            case '\n': ss << "\\n"; break;
            case '\r': ss << "\\r"; break;
            case '\t': ss << "\\t"; break;
            default:
                if ('\x00' <= c && c <= '\x1f') {
                    // Not handled for simplicity
                } else {
                    ss << c;
                }
        }
    }
    return ss.str();
}

inline std::string product_to_json(const Product& p) {
    std::stringstream ss;
    ss << "{";
    ss << "\"id\":" << p.id << ",";
    ss << "\"sku\":\"" << escape_json(p.sku) << "\",";
    ss << "\"name\":\"" << escape_json(p.name) << "\",";
    ss << "\"price\":" << p.price << ",";
    ss << "\"quantity\":" << p.quantity << ",";
    ss << "\"category\":\"" << escape_json(p.category) << "\"";
    ss << "}";
    return ss.str();
}

inline std::string order_to_json(const Order& o) {
    std::stringstream ss;
    ss << "{";
    ss << "\"id\":" << o.id << ",";
    ss << "\"customerName\":\"" << escape_json(o.customerName) << "\",";
    ss << "\"totalValue\":" << o.totalValue << ",";
    ss << "\"itemCount\":" << o.itemCount << ",";
    ss << "\"items\":[";
    for(int i = 0; i < o.itemCount; ++i) {
        ss << "{";
        ss << "\"productId\":" << o.items[i].productId << ",";
        ss << "\"quantity\":" << o.items[i].quantity << ",";
        ss << "\"pricePerItem\":" << o.items[i].pricePerItem;
        ss << "}";
        if (i < o.itemCount - 1) ss << ",";
    }
    ss << "]"; // end items
    ss << "}";
    return ss.str();
}

template<typename T, typename Func>
std::string vector_to_json(const std::vector<T>& vec, Func to_json_func) {
    std::stringstream ss;
    ss << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        ss << to_json_func(vec[i]);
        if (i < vec.size() - 1) ss << ",";
    }
    ss << "]";
    return ss.str();
}


struct CompareProductStock {
    bool operator()(const Product& a, const Product& b) {
        return a.quantity > b.quantity;
    }
};

using ProductMinHeap = std::priority_queue<Product, std::vector<Product>, CompareProductStock>;

inline bool compareProductNameASC(const Product& a, const Product& b) { return std::string(a.name) < std::string(b.name); }
inline bool compareProductNameDESC(const Product& a, const Product& b) { return std::string(a.name) > std::string(b.name); }
inline bool compareProductPriceASC(const Product& a, const Product& b) { return a.price < b.price; }
inline bool compareProductPriceDESC(const Product& a, const Product& b) { return a.price > b.price; }
inline bool compareProductQtyASC(const Product& a, const Product& b) { return a.quantity < b.quantity; }
inline bool compareProductQtyDESC(const Product& a, const Product& b) { return a.quantity > b.quantity; }