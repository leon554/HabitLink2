import Create from "../components/Create"

export default function CreatePage() {

    return (
        <div className="flex mb-5 flex-col items-center mt-20">
            <div className="max-w-[90%]">
                <Create compact={false}/>
            </div>
        </div>
    )
}
