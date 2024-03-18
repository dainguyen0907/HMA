import React from "react";
import hepc_bg from "../../src/assets/images/hepc_bg.jpg";

export default function HomePage() {
    return (
        <div style={{
            backgroundImage: `url(${hepc_bg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }} className="w-full h-full">
            <div className="fixed bottom-0 text-white p-2 w-full ">
                <center>
                    <div className="p-2 bg-blue-600 bg-opacity-80 w-fit rounded-xl font-bold">
                        <p>Bản quyền thuộc về HEPC. Được phát triển bởi Nguyễn Quốc Đại</p>
                        Phiên bản: 1.0.0
                    </div>
                </center>
            </div>

        </div>
    )
}