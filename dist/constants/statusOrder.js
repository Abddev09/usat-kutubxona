"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["CREATED"] = 1] = "CREATED";
    OrderStatus[OrderStatus["READY_FOR_PICKUP"] = 2] = "READY_FOR_PICKUP";
    OrderStatus[OrderStatus["READING"] = 3] = "READING";
    OrderStatus[OrderStatus["RETURN_DUE"] = 4] = "RETURN_DUE";
    OrderStatus[OrderStatus["EXTENDED"] = 5] = "EXTENDED";
    OrderStatus[OrderStatus["REJECTED"] = 6] = "REJECTED";
    OrderStatus[OrderStatus["OVERDUE"] = 7] = "OVERDUE";
    OrderStatus[OrderStatus["ARCHIVED"] = 8] = "ARCHIVED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
