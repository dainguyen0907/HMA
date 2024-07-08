import React from "react";

export default function HomePage() {
    return (
        <div className="w-full h-[90svh] flex items-center justify-center">
            <div className="text-start text-white p-2 w-fit bg-gray-500 rounded-lg flex flex-col gap-2">
                <span>Tên sản phẩm: Phần mềm quản lý nhà nghỉ HEPC</span>
                <span>Phiên bản: 0.0.1 (Demo)</span>
                <span>Người phát triển: Nguyễn Quốc Đại</span>
                <span>Bản quyền sản phẩm thuộc về Trường Cao đẳng Điện lực TPHCM</span>
                <span>554 Hà Huy Giáp, Thạnh Lộc, Quận 12, Thành phố Hồ Chí Minh</span>
            </div>

        </div>
    )
}