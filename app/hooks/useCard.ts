import { FaRunning, FaFlagCheckered } from "react-icons/fa"
import { TbSquareRoundedNumber1 } from "react-icons/tb"
import { CiTimer } from "react-icons/ci"

const useCard = () => {
  
    const cardItem = [
        {
            title: "Top 1",
            icon: TbSquareRoundedNumber1,
            color: "bg-blue-400",
            value: "#012"
        }, {
            title: "Best Time",
            icon: CiTimer,
            color: "bg-green-400",
            value: "01:31:45"
        }, {
            title: "Finished",
            icon: FaFlagCheckered,
            color: "bg-rose-400",
            value: "16"
        }, {
            title: "Jumlah Peserta",
            icon: FaRunning,
            color: "bg-violet-400",
            value: "16"
        }
    ]

    return cardItem
}

export default useCard