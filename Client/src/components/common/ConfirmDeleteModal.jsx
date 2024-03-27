import React from "react"
import ButtonComponent from "./ButtonComponent"

const ConfirmDeleteModal = ({ Id, handleDelete, setShowConfirmationModal, setDataIdToBeDeleted , itemType  }) => {
	const cancelDelete = () => {
		setShowConfirmationModal(false)
		setDataIdToBeDeleted(null)
	}

	return (
		<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-screen h-screen z-50 bg-[rgba(0,0,0,0.2)]">
			<div className="z-50 bg-slate-50 px-5 py-5 w-[min(90%,450px)] rounded-md relative">
				<button className="absolute top-3 right-3 text-xs" onClick={cancelDelete}>
					❌
				</button>
				<h2 className="text-2xl font-medium">Delete Confirmation</h2>
				<hr className="h-2 mt-3" />
				<p className="mt-4 text-base bg-red-200 text-red-900 font-medium p-5  rounded-md">
					Are you sure you want to delete {itemType} with ID: {Id}
				</p>
				<div className="flex w-full mx-auto justify-end gap-5">
					<ButtonComponent
						buttonStyle="py-[0.3rem!important] bg-[white!important] text-[black!important] border-[transparent!important] hover:text-[black!important] hover:bg-[#ccc!important]"
						onClick={cancelDelete}>
						Cancel
					</ButtonComponent>
					<ButtonComponent
						buttonStyle="py-[0.3rem!important] bg-[#c53030!important] text-[white!important] border-[transparent!important] hover:border-[#c53030!important] hover:text-[#c53030!important] hover:bg-[#fff!important]"
						onClick={() => handleDelete(Id)}>
						Delete
					</ButtonComponent>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDeleteModal
