import React, { Dispatch, SetStateAction, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel';
import { Event } from '../../../../../services/events/types';
import { colorSwitch } from '../../../../../utils/functions/switches';

interface CarouselProps {
	eventList: Event[]
	changePage: Dispatch<SetStateAction<string>>
	selectEvent: Dispatch<SetStateAction<number | null>>
}

export const EmblaCarousel = ({ eventList, changePage, selectEvent }: CarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: 'center',
		speed: 25
	}, []);

	const [emblaRef2, emblaApi2] = useEmblaCarousel({
		align: 'center',
		draggable: false,
		speed: 50
	}, []);

	const numberWithinProgress = (number: number) => Math.min(Math.max(number, 0), 1);

	const createScrollProgressUtils = (embla: EmblaCarouselType) => {
		const withinBounds = (distance: number) => {
			const { target, limit } = embla.internalEngine();
			const { min, max, reachedMin, reachedMax } = limit;
			const destination = target.get() + distance;

			if (reachedMax(destination)) return max - target.get();
			if (reachedMin(destination)) return min - target.get();
			return distance;
		};

		const currentProgress = () => {
			const { target, scrollProgress } = embla.internalEngine();
			return scrollProgress.get(target.get());
		};

		const add = (progress: number) => {
			const { limit, options } = embla.internalEngine();
			if (options.loop) return limit.length * progress;
			return withinBounds(limit.length * progress * -1);
		};

		const set = (progress: number) => {
			const { limit } = embla.internalEngine();
			const allowedProgress = numberWithinProgress(progress);
			const progressToTarget = allowedProgress - currentProgress();
			return progressToTarget * limit.length * -1;
		};

		return {
			scrollToProgress: (progress: number, snap: boolean) => {
				const { scrollBody, scrollTo } = embla.internalEngine();
				const distance = set(progress);
				scrollBody.useBaseMass().useBaseSpeed();
				scrollTo.distance(distance, !!snap);
			},
			scrollByProgress: (progress: number, snap: boolean) => {
				const { scrollBody, scrollTo } = embla.internalEngine();
				const distance = add(progress);
				scrollBody.useBaseMass().useBaseSpeed();
				scrollTo.distance(distance, !!snap);
			}
		};
	};

	useEffect(() => {
		if(!emblaApi || !emblaApi2) return;
		const { scrollToProgress } = createScrollProgressUtils(emblaApi2);
		
		emblaApi.on('scroll', () => {
			const progress = emblaApi.scrollProgress();
			scrollToProgress(progress, false);
		});

		return () => {
			emblaApi.destroy();
			emblaApi2.destroy();
		};
	}, [emblaApi, emblaApi2]);

	return (
		<>
			<div 
				className="embla" 
				ref={emblaRef} 
				style={{
					width: '100%',
					height: '75%'
				}}
			>
				<div 
					className="embla__container"
					style={{
						width: '100%',
						height: '100%'
					}}
				>
					{eventList.map((event) => {
						return (
							<div key={event.name} className="embla__slide">
								<img style={{ height: '100%', padding: '4em' }} src={event.logoURL || 'https://i.imgur.com/myhmEJH.png'} />
							</div>
						);
					})}
				</div>
			</div>
			
			<div 
				className="embla" 
				ref={emblaRef2} 
				style={{
					width: '100%',
					height: '25%'
				}}
			>
				<div 
					className="embla__container"
					style={{
						width: '100%',
						height: '100%'
					}}
				>
					{eventList.map((event) => {
						return (
							<div key={event.name} className="embla__slide__2">
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div style={{ 
										fontSize: '2.25em', 
										width: '2.25em', 
										height: '2.25em', 
										overflow: 'hidden', 
										padding: '0.25em', 
										borderRadius: '50%',
										border: '0.2em solid #ffffff',
										boxSizing: 'border-box',
										boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.25)',
										display: 'flex',
										backgroundColor: colorSwitch(event.eventCategoryId),
										cursor: 'pointer'
									}}
									onClick={() => {
										selectEvent(event.id);
										changePage('event');
									}}
									>
										<img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={event.logoURL || 'https://i.imgur.com/myhmEJH.png'} />
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};