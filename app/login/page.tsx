import Footer from "@/components/Footer"

export default function Login() {
	return (

		<div className="bg-black flex flex-col justify-between min-h-dvh">

            <main className="grow max-h-100 flex flex-col items-center justify-center p-1">

                <div className="mx-auto min-w-72 w-fit p-2 outline outline-zinc-600 rounded-lg bg-zinc-950 text-center">
                    <h2 className="font-bold text-2xl">Login</h2>
                    <input className="" placeholder="Username"/>
                    <input className="" placeholder="a"/>
                </div>

            </main>

            <Footer/>

		</div>

	);
}
