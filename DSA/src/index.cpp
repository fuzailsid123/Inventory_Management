#include <napi.h>
#include "dsa_algos.h"
#include <vector>
#include <string>

// Helper to convert JS object to StockLocation
static StockLocation toStockLocation(const Napi::Env& env, const Napi::Object& obj) {
  StockLocation loc{};
  if (obj.Has("warehouse")) {
    Napi::Value w = obj.Get("warehouse");
    if (w.IsString()) {
      loc.warehouseId = w.ToString();
    } else if (w.IsObject()) {
      Napi::Object wObj = w.As<Napi::Object>();
      if (wObj.Has("_id")) {
        loc.warehouseId = wObj.Get("_id").ToString();
      }
    }
  }
  if (obj.Has("quantity")) loc.quantity = obj.Get("quantity").ToNumber().DoubleValue();
  if (obj.Has("reserved")) loc.reserved = obj.Get("reserved").ToNumber().DoubleValue();
  return loc;
}

// Helper to convert JS object to Batch
static Batch toBatch(const Napi::Env& env, const Napi::Object& obj) {
  Batch b{};
  if (obj.Has("batchNumber")) b.batchNumber = obj.Get("batchNumber").ToString();
  if (obj.Has("quantity")) b.quantity = obj.Get("quantity").ToNumber().DoubleValue();
  
  if (obj.Has("expiryDate")) {
    Napi::Value v = obj.Get("expiryDate");
    if (v.IsNumber()) {
      b.expiryDateMs = static_cast<std::int64_t>(v.As<Napi::Number>().Int64Value());
    } else if (v.IsString()) {
      // Try to parse ISO date string (basic support)
      b.expiryDateMs = 0; // Let JS handle date parsing
    }
  }
  
  if (obj.Has("manufacturingDate")) {
    Napi::Value v = obj.Get("manufacturingDate");
    if (v.IsNumber()) {
      b.manufacturingDateMs = static_cast<std::int64_t>(v.As<Napi::Number>().Int64Value());
    }
  }
  
  return b;
}

// Convert JS value to Product
static Product toProduct(const Napi::Env& env, const Napi::Object& obj) {
  Product p{};
  
  // Basic fields
  if (obj.Has("_id")) p.id = obj.Get("_id").ToString();
  if (obj.Has("id")) p.id = obj.Get("id").ToString();
  if (obj.Has("name")) p.name = obj.Get("name").ToString();
  if (obj.Has("sku")) p.sku = obj.Get("sku").ToString();
  if (obj.Has("barcode")) p.barcode = obj.Get("barcode").ToString();
  
  // Category and Supplier (handle ObjectId or string)
  if (obj.Has("category")) {
    Napi::Value cat = obj.Get("category");
    if (cat.IsString()) {
      p.categoryId = cat.ToString();
    } else if (cat.IsObject()) {
      Napi::Object catObj = cat.As<Napi::Object>();
      if (catObj.Has("_id")) {
        p.categoryId = catObj.Get("_id").ToString();
      }
    }
  }
  
  if (obj.Has("supplier")) {
    Napi::Value sup = obj.Get("supplier");
    if (sup.IsString()) {
      p.supplierId = sup.ToString();
    } else if (sup.IsObject()) {
      Napi::Object supObj = sup.As<Napi::Object>();
      if (supObj.Has("_id")) {
        p.supplierId = supObj.Get("_id").ToString();
      }
    }
  }
  
  // Quantities
  if (obj.Has("quantity")) p.quantity = obj.Get("quantity").ToNumber().DoubleValue();
  if (obj.Has("reorderLevel")) p.reorderLevel = obj.Get("reorderLevel").ToNumber().DoubleValue();
  if (obj.Has("reorderQuantity")) p.reorderQuantity = obj.Get("reorderQuantity").ToNumber().DoubleValue();
  if (obj.Has("maxStock")) p.maxStock = obj.Get("maxStock").ToNumber().DoubleValue();
  if (obj.Has("turnoverRate")) p.turnoverRate = obj.Get("turnoverRate").ToNumber().DoubleValue();
  
  // Pricing
  if (obj.Has("costPrice")) p.costPrice = obj.Get("costPrice").ToNumber().DoubleValue();
  if (obj.Has("sellingPrice")) p.sellingPrice = obj.Get("sellingPrice").ToNumber().DoubleValue();
  
  // Stock locations
  if (obj.Has("stockLocations") && obj.Get("stockLocations").IsArray()) {
    Napi::Array locations = obj.Get("stockLocations").As<Napi::Array>();
    for (uint32_t i = 0; i < locations.Length(); ++i) {
      Napi::Value v = locations.Get(i);
      if (v.IsObject()) {
        p.stockLocations.push_back(toStockLocation(env, v.As<Napi::Object>()));
      }
    }
  }
  
  // Batches
  if (obj.Has("batches") && obj.Get("batches").IsArray()) {
    Napi::Array batches = obj.Get("batches").As<Napi::Array>();
    for (uint32_t i = 0; i < batches.Length(); ++i) {
      Napi::Value v = batches.Get(i);
      if (v.IsObject()) {
        p.batches.push_back(toBatch(env, v.As<Napi::Object>()));
      }
    }
  }
  
  // Dates
  if (obj.Has("lastSoldDate")) {
    Napi::Value v = obj.Get("lastSoldDate");
    if (v.IsNumber()) {
      p.lastSoldMs = static_cast<std::int64_t>(v.As<Napi::Number>().Int64Value());
    } else if (v.IsString()) {
      // Let JS handle date parsing - set to 0 for now
      p.lastSoldMs = 0;
    } else if (v.IsNull() || v.IsUndefined()) {
      p.lastSoldMs = 0;
    }
  }
  
  // Booleans
  if (obj.Has("isActive")) p.isActive = obj.Get("isActive").ToBoolean();
  if (obj.Has("lowStockAlert")) p.lowStockAlert = obj.Get("lowStockAlert").ToBoolean();
  
  return p;
}

// Convert ReorderSuggestion to JS object
static Napi::Object suggestionToJS(const Napi::Env& env, const ReorderSuggestion& suggestion, const Napi::Array& originalProducts) {
  Napi::Object obj = Napi::Object::New(env);
  obj.Set("productIndex", Napi::Number::New(env, suggestion.productIndex));
  obj.Set("priorityScore", Napi::Number::New(env, suggestion.priorityScore));
  obj.Set("suggestedQuantity", Napi::Number::New(env, suggestion.suggestedQuantity));
  obj.Set("reason", Napi::String::New(env, suggestion.reason));
  
  // Include the original product object
  if (suggestion.productIndex < originalProducts.Length()) {
    obj.Set("product", originalProducts.Get(suggestion.productIndex));
  }
  
  return obj;
}

// Original topKToReorder function (backward compatible)
Napi::Value topKToReorderWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsArray() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Expected (Array products, Number top)").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  
  Napi::Array arr = info[0].As<Napi::Array>();
  size_t top = static_cast<size_t>(info[1].As<Napi::Number>().Int64Value());
  
  std::vector<Product> products;
  products.reserve(arr.Length());
  for (uint32_t i = 0; i < arr.Length(); ++i) {
    Napi::Value v = arr.Get(i);
    if (!v.IsObject()) continue;
    Product p = toProduct(env, v.As<Napi::Object>());
    products.push_back(p);
  }
  
  std::vector<size_t> idx = topKToReorderIndices(products, top);
  Napi::Array out = Napi::Array::New(env, idx.size());
  for (size_t i = 0; i < idx.size(); ++i) {
    out.Set(i, arr.Get(static_cast<uint32_t>(idx[i])));
  }
  return out;
}

// New function: topKToReorderWithDetails
Napi::Value topKToReorderWithDetailsWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsArray() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Expected (Array products, Number top, [String warehouseId])").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  
  Napi::Array arr = info[0].As<Napi::Array>();
  size_t top = static_cast<size_t>(info[1].As<Napi::Number>().Int64Value());
  std::string warehouseId = "";
  
  if (info.Length() > 2 && info[2].IsString()) {
    warehouseId = info[2].As<Napi::String>().Utf8Value();
  }
  
  std::vector<Product> products;
  products.reserve(arr.Length());
  for (uint32_t i = 0; i < arr.Length(); ++i) {
    Napi::Value v = arr.Get(i);
    if (!v.IsObject()) continue;
    Product p = toProduct(env, v.As<Napi::Object>());
    products.push_back(p);
  }
  
  std::vector<ReorderSuggestion> suggestions = topKToReorderWithDetails(products, top, warehouseId);
  Napi::Array out = Napi::Array::New(env, suggestions.size());
  for (size_t i = 0; i < suggestions.size(); ++i) {
    out.Set(i, suggestionToJS(env, suggestions[i], arr));
  }
  return out;
}

// Calculate inventory value
Napi::Value calculateInventoryValueWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsArray()) {
    Napi::TypeError::New(env, "Expected (Array products)").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  
  Napi::Array arr = info[0].As<Napi::Array>();
  std::vector<Product> products;
  products.reserve(arr.Length());
  for (uint32_t i = 0; i < arr.Length(); ++i) {
    Napi::Value v = arr.Get(i);
    if (!v.IsObject()) continue;
    Product p = toProduct(env, v.As<Napi::Object>());
    products.push_back(p);
  }
  
  InventoryValue value = calculateInventoryValue(products);
  Napi::Object result = Napi::Object::New(env);
  result.Set("totalValue", Napi::Number::New(env, value.totalValue));
  result.Set("lowStockValue", Napi::Number::New(env, value.lowStockValue));
  result.Set("totalProducts", Napi::Number::New(env, value.totalProducts));
  result.Set("lowStockCount", Napi::Number::New(env, value.lowStockCount));
  result.Set("outOfStockCount", Napi::Number::New(env, value.outOfStockCount));
  
  return result;
}

// ABC Analysis
Napi::Value abcAnalysisWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsArray()) {
    Napi::TypeError::New(env, "Expected (Array products)").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  
  Napi::Array arr = info[0].As<Napi::Array>();
  std::vector<Product> products;
  products.reserve(arr.Length());
  for (uint32_t i = 0; i < arr.Length(); ++i) {
    Napi::Value v = arr.Get(i);
    if (!v.IsObject()) continue;
    Product p = toProduct(env, v.As<Napi::Object>());
    products.push_back(p);
  }
  
  std::map<char, std::vector<size_t>> abc = abcAnalysis(products);
  Napi::Object result = Napi::Object::New(env);
  
  for (const auto& [category, indices] : abc) {
    Napi::Array catArray = Napi::Array::New(env, indices.size());
    for (size_t i = 0; i < indices.size(); ++i) {
      catArray.Set(i, arr.Get(static_cast<uint32_t>(indices[i])));
    }
    result.Set(std::string(1, category), catArray);
  }
  
  return result;
}

// Get expiring batches
Napi::Value getExpiringBatchesWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsArray()) {
    Napi::TypeError::New(env, "Expected (Array products, [Number daysAhead])").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  
  Napi::Array arr = info[0].As<Napi::Array>();
  int daysAhead = 30;
  if (info.Length() > 1 && info[1].IsNumber()) {
    daysAhead = info[1].As<Napi::Number>().Int32Value();
  }
  
  std::vector<Product> products;
  products.reserve(arr.Length());
  for (uint32_t i = 0; i < arr.Length(); ++i) {
    Napi::Value v = arr.Get(i);
    if (!v.IsObject()) continue;
    Product p = toProduct(env, v.As<Napi::Object>());
    products.push_back(p);
  }
  
  std::vector<size_t> indices = getExpiringBatches(products, daysAhead);
  Napi::Array result = Napi::Array::New(env, indices.size());
  for (size_t i = 0; i < indices.size(); ++i) {
    result.Set(i, arr.Get(static_cast<uint32_t>(indices[i])));
  }
  
  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "topKToReorder"), 
              Napi::Function::New(env, topKToReorderWrapped));
  exports.Set(Napi::String::New(env, "topKToReorderWithDetails"), 
              Napi::Function::New(env, topKToReorderWithDetailsWrapped));
  exports.Set(Napi::String::New(env, "calculateInventoryValue"), 
              Napi::Function::New(env, calculateInventoryValueWrapped));
  exports.Set(Napi::String::New(env, "abcAnalysis"), 
              Napi::Function::New(env, abcAnalysisWrapped));
  exports.Set(Napi::String::New(env, "getExpiringBatches"), 
              Napi::Function::New(env, getExpiringBatchesWrapped));
  return exports;
}

NODE_API_MODULE(dsa, Init)
