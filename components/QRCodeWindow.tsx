import QrCode from "qrcode";

export default function QRCodeWindow(qrCodeUrl: string) {
    if (qrCodeUrl === "") {
        return (<></>);
    }

    return (<>
        <h1>{qrCodeUrl}</h1>
    </>)
}