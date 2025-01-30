import Typography from '@components/Typography'

const page404 = () => {
    return (
        <section class="w-full h-full flex flex-col gap-24 justify-center items-center">
            <Typography color="white" text="h1">
                404: Not Found
            </Typography>
            <Typography color="white" text="h3">
                Welp, something went wrong 😞
            </Typography>
        </section>
    )
}

export default page404
