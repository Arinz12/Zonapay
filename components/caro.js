import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { 
  MdVisibility, 
  MdSchedule, 
  MdAccountBalance 
} from 'react-icons/md';

const EnhancedCarousel = () => {
  return (
    <div className="max-w-lg mx-auto my-8">
      <Carousel
        autoPlay={true}
        interval={4000}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        showArrows={false}
        stopOnHover={true}
        swipeable={true}
        dynamicHeight={false}
        emulateTouch={true}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <button
            type="button"
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            key={index}
            className={`mx-1 w-3 h-3 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}
            aria-label={`Slide ${index + 1}`}
          />
        )}
      >
        {/* Slide 1 */}
        <div className="p-6 flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <MdVisibility className="text-blue-600 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Transparent Transactions</h3>
          <p className="text-gray-600 text-center">
            Enjoy seamless transparent transactions where everything happening is clear
          </p>
        </div>

        {/* Slide 2 */}
        <div className="p-6 flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <MdSchedule className="text-green-600 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Scheduled Payments</h3>
          <p className="text-gray-600 text-center">
            Schedule bill payments so you worry not about forgetting
          </p>
        </div>

        {/* Slide 3 */}
        <div className="p-6 flex flex-col items-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <MdAccountBalance className="text-purple-600 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Funds Allocation</h3>
          <p className="text-gray-600 text-center">
            Map out funds specifically for bills
          </p>
        </div>
      </Carousel>
    </div>
  );
};

export default EnhancedCarousel;