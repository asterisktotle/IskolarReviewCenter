import {
	Button,
	Spinner,
	IconButton,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Box,
	Text,
	useBreakpointValue,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	useDisclosure,
	Tooltip,
	HStack,
	VStack,
	Alert,
	AlertIcon,
	AlertDescription,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import usePdfViewer from '../hooks/usePdfViewer.ts';
import { useParams, useNavigate } from 'react-router-dom';

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ViewIcon,
	ArrowBackIcon,
	AddIcon,
	MinusIcon,
} from '@chakra-ui/icons';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString();

const ViewPdf = () => {
	const { pdfId } = useParams();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// PDF State
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [scale, setScale] = useState(1);
	const [pageInput, setPageInput] = useState('1');
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Responsive breakpoints
	const isMobile = useBreakpointValue({ base: true, md: false });
	const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
	const iconSize = useBreakpointValue({ base: 4, md: 5 });

	const { setSelectedPdf, pdfUrl, errorMessage, loading } = usePdfViewer();

	useEffect(() => {
		if (!pdfId) {
			console.log('no pdf selected');
			return;
		}
		setSelectedPdf(pdfId);
	}, [pdfId, setSelectedPdf]);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
		setNumPages(numPages);
	};

	// Calculate responsive PDF width
	const getPdfWidth = useCallback(() => {
		if (isFullscreen) {
			return Math.min(window.innerWidth - 40, 1200);
		}
		if (isMobile) {
			return window.innerWidth - 32;
		}
		return Math.min(window.innerWidth - 64, 800);
	}, [isMobile, isFullscreen]);

	const [pdfWidth, setPdfWidth] = useState(getPdfWidth());

	// Update PDF width on resize
	useEffect(() => {
		const handleResize = () => {
			setPdfWidth(getPdfWidth());
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [getPdfWidth]);

	// Navigation handlers
	const handleNextPage = () => {
		if (numPages && pageNumber < numPages) {
			const newPage = pageNumber + 1;
			setPageNumber(newPage);
			setPageInput(newPage.toString());
		}
	};

	const handlePreviousPage = () => {
		if (pageNumber > 1) {
			const newPage = pageNumber - 1;
			setPageNumber(newPage);
			setPageInput(newPage.toString());
		}
	};

	const handlePageInputChange = (e) => {
		setPageInput(e.target.value);
	};

	const handlePageInputSubmit = (e) => {
		e.preventDefault();
		const page = parseInt(pageInput);
		if (page >= 1 && page <= numPages) {
			setPageNumber(page);
		} else {
			setPageInput(pageNumber.toString());
		}
	};

	// Zoom handlers
	const handleZoomIn = () => {
		setScale((prev) => Math.min(prev + 0.25, 3));
	};

	const handleZoomOut = () => {
		setScale((prev) => Math.max(prev - 0.25, 0.5));
	};

	const handleScaleChange = (value) => {
		setScale(value);
	};

	// Fullscreen handlers
	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
		if (!isFullscreen) {
			onOpen();
		} else {
			onClose();
		}
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === 'ArrowLeft' && pageNumber > 1) {
				handlePreviousPage();
			} else if (e.key === 'ArrowRight' && pageNumber < numPages) {
				handleNextPage();
			} else if (e.key === 'Escape' && isFullscreen) {
				toggleFullscreen();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [pageNumber, numPages, isFullscreen]);

	// Error state
	if (errorMessage) {
		return (
			<Box p={6} maxW="lg" mx="auto">
				<Alert status="error" borderRadius="lg">
					<AlertIcon />
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
				<Button
					mt={4}
					leftIcon={<ArrowBackIcon />}
					onClick={() => navigate(-1)}
				>
					Go Back
				</Button>
			</Box>
		);
	}

	// PDF Controls Component
	const PdfControls = ({ isCompact = false }) => (
		<VStack
			spacing={4}
			p={4}
			bg="whiteAlpha.100"
			backdropFilter="blur(10px)"
			borderRadius="lg"
			border="1px solid"
			borderColor="whiteAlpha.200"
		>
			{/* Navigation Controls */}
			<HStack spacing={2} wrap="wrap" justify="center">
				<Tooltip label="Previous Page (←)">
					<IconButton
						icon={<ChevronLeftIcon boxSize={iconSize} />}
						onClick={handlePreviousPage}
						disabled={pageNumber === 1}
						size={buttonSize}
						variant="ghost"
						color="white"
						_hover={{ bg: 'whiteAlpha.200' }}
					/>
				</Tooltip>

				{/* Page Input */}
				<form onSubmit={handlePageInputSubmit}>
					<InputGroup size={buttonSize} maxW="120px">
						<Input
							value={pageInput}
							onChange={handlePageInputChange}
							textAlign="center"
							bg="whiteAlpha.100"
							border="1px solid"
							borderColor="whiteAlpha.300"
							color="white"
							_focus={{ borderColor: 'purple.400' }}
						/>
						<InputRightElement pointerEvents="none">
							<Text fontSize="sm" color="gray.400">
								/{numPages}
							</Text>
						</InputRightElement>
					</InputGroup>
				</form>

				<Tooltip label="Next Page (→)">
					<IconButton
						icon={<ChevronRightIcon boxSize={iconSize} />}
						onClick={handleNextPage}
						disabled={pageNumber === numPages}
						size={buttonSize}
						variant="ghost"
						color="white"
						_hover={{ bg: 'whiteAlpha.200' }}
					/>
				</Tooltip>
			</HStack>

			{/* Zoom Controls */}
			{!isCompact && (
				<HStack spacing={4} w="full" maxW="300px">
					<Tooltip label="Zoom Out">
						<IconButton
							icon={<MinusIcon />}
							onClick={handleZoomOut}
							disabled={scale <= 0.5}
							size="sm"
							variant="ghost"
							color="white"
							_hover={{ bg: 'whiteAlpha.200' }}
						/>
					</Tooltip>

					<Box flex={1}>
						<Slider
							value={scale}
							min={0.5}
							max={3}
							step={0.25}
							onChange={handleScaleChange}
							colorScheme="purple"
						>
							<SliderTrack bg="whiteAlpha.300">
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>
						<Text textAlign="center" fontSize="xs" color="gray.300" mt={1}>
							{Math.round(scale * 100)}%
						</Text>
					</Box>

					<Tooltip label="Zoom In">
						<IconButton
							icon={<AddIcon />}
							onClick={handleZoomIn}
							disabled={scale >= 3}
							size="sm"
							variant="ghost"
							color="white"
							_hover={{ bg: 'whiteAlpha.200' }}
						/>
					</Tooltip>
				</HStack>
			)}

			{/* Action Buttons */}
			<HStack spacing={2} wrap="wrap" justify="center">
				<Tooltip label="Fullscreen View">
					<Button
						leftIcon={<ViewIcon />}
						onClick={toggleFullscreen}
						size={buttonSize}
						colorScheme="purple"
						variant="solid"
					>
						{isCompact ? 'Full' : 'Fullscreen'}
					</Button>
				</Tooltip>

				<Button
					leftIcon={<ArrowBackIcon />}
					onClick={() => navigate(-1)}
					size={buttonSize}
					variant="outline"
					color="white"
					borderColor="whiteAlpha.300"
					_hover={{ bg: 'whiteAlpha.200' }}
				>
					Back
				</Button>
			</HStack>
		</VStack>
	);

	// Main PDF Viewer
	const PdfViewer = ({ fullscreen = false }) => (
		<Box
			w="full"
			display="flex"
			flexDirection="column"
			alignItems="center"
			minH={fullscreen ? '100vh' : 'auto'}
			bg={fullscreen ? 'black' : 'transparent'}
			p={fullscreen ? 4 : 0}
		>
			{loading ? (
				<VStack spacing={4} py={20}>
					<Spinner
						thickness="4px"
						speed="0.65s"
						emptyColor="gray.600"
						color="purple.500"
						size="xl"
					/>
					<Text color="gray.300">Loading PDF...</Text>
				</VStack>
			) : (
				<VStack spacing={6} w="full" align="center">
					{/* PDF Document */}
					<Box
						border="2px solid"
						borderColor="whiteAlpha.200"
						borderRadius="lg"
						overflow="hidden"
						shadow="2xl"
						bg="white"
					>
						<Document
							file={pdfUrl}
							onLoadSuccess={onDocumentLoadSuccess}
							loading={
								<Box p={10}>
									<Spinner color="purple.500" />
								</Box>
							}
						>
							<Page
								pageNumber={pageNumber}
								renderAnnotationLayer={false}
								renderTextLayer={false}
								width={pdfWidth * scale}
								scale={1}
							/>
						</Document>
					</Box>

					{/* Controls */}
					<PdfControls isCompact={isMobile} />
				</VStack>
			)}
		</Box>
	);

	return (
		<>
			{/* Regular View */}
			<Box p={{ base: 4, md: 6 }} minH="100vh">
				<VStack spacing={6} align="center">
					<Text
						fontSize={{ base: 'xl', md: '2xl' }}
						fontWeight="bold"
						color="white"
						textAlign="center"
					>
						📖 PDF Viewer
					</Text>

					<PdfViewer />
				</VStack>
			</Box>

			{/* Fullscreen Modal */}
			<Modal
				isOpen={isOpen}
				onClose={() => {
					onClose();
					setIsFullscreen(false);
				}}
				size="full"
				motionPreset="slideInBottom"
			>
				<ModalOverlay bg="blackAlpha.900" />
				<ModalContent bg="transparent" shadow="none">
					<ModalBody p={0}>
						<PdfViewer fullscreen={true} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ViewPdf;
