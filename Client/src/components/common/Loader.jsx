import { BallTriangle } from "react-loader-spinner"

const Loader = () => {
	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-screen h-screen bg-[rgba(0,0,0,0.2)] z-[100]">
			<div className="z-[100]">
				<BallTriangle
					height={100}
					width={100}
					radius={5}
					color="#0296db"
					ariaLabel="ball-triangle-loading"
					visible={true}
				/>
			</div>
		</div>
	)
}

export default Loader
