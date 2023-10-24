const page404 = () => {
    return (
        <section
            class="text-white flex flex-col items-center justify-center fixed h-[100%] p-8"
            style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                '-webkit-transform': 'translate(-50%, -50%)',
            }}>
            <div class="card rounded-md bg-slate-700">
                <h1 class="text-2xl font-bold">404: Not Found</h1>
                <p class="mt-4 text-gray-400 text-lg">Welp, something went wrong 😞</p>
            </div>
        </section>
    )
}

export default page404
