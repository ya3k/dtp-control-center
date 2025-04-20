'use client'
import BasicTourInfoForm from "@/components/operator/tours/post-tour/basic-tour-info";
import ProgressBar from "@/components/operator/tours/post-tour/progressbar";
import ReviewForm from "@/components/operator/tours/post-tour/review-tour-submit";
import TourAdditionalInfoForm from "@/components/operator/tours/post-tour/tour-additional-info";
import TourDestinationForm from "@/components/operator/tours/post-tour/tour-destination";
import TourScheduleInfoForm from "@/components/operator/tours/post-tour/tour-schedule-info";
import TourTicketForm from "@/components/operator/tours/post-tour/tour-ticket";
import useTourStore from "@/store/tourStore"


export default function POSTTourPage() {

    const { step } = useTourStore();

    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicTourInfoForm />
            case 2:
                return <TourScheduleInfoForm />
            case 3:
                return <TourAdditionalInfoForm />
            case 4:
                return <TourDestinationForm />
            case 5:
                return <TourTicketForm />
            default:
                return <ReviewForm />
        }
    }

    return (
        <div className="flex flex-col gap-4 mx-3">
            <h1 className="text-2xl font-bold">Post Tour</h1>

            {/* progress bar */}
            <ProgressBar  />
            {/* step */}
            <div className="flex flex-col gap-4">
                {renderStep()}
            </div>
        </div>
    )
}
