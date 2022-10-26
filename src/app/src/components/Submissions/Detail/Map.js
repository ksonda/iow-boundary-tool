import { useSelector } from 'react-redux';
import { Box, Button, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChatAltIcon, DownloadIcon, MailIcon } from '@heroicons/react/outline';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';

import { DefaultBasemap } from '../../Layers/Basemaps';
import MapPanes from '../../MapPanes';

import {
    BOUNDARY_STATUS,
    MAP_CENTER,
    MAP_INITIAL_ZOOM,
    POLYGON_LAYER_OPTIONS,
    ROLES,
} from '../../../constants';
import { useMapLayer } from '../../../hooks';
import {
    downloadData,
    getBoundaryShapeFilename,
    getBoundaryPermissions,
} from '../../../utils';

export default function Map({ boundary, startReview }) {
    const StatusBar = useSubmissionStatusBar(boundary);

    return (
        <>
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_INITIAL_ZOOM}
                zoomControl={false}
                style={{
                    height: StatusBar
                        ? 'calc(100% - var(--chakra-sizes-12))'
                        : '100%',
                }}
            >
                <MapPanes>
                    <DefaultBasemap />
                    <MapButtons boundary={boundary} startReview={startReview} />
                    <Polygon shape={boundary.submission.shape} />
                </MapPanes>
            </MapContainer>
            {StatusBar}
        </>
    );
}

function MapButtons({ boundary, startReview }) {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    const { canWrite, canReview } = getBoundaryPermissions({ boundary, user });

    const getDrawButtonText = () => {
        switch (boundary.status) {
            case BOUNDARY_STATUS.DRAFT:
                return canWrite ? 'Edit boundary' : null;
            case BOUNDARY_STATUS.SUBMITTED:
                return canReview ? 'Start review' : null;
            case BOUNDARY_STATUS.IN_REVIEW:
                return canReview ? 'Continue review' : null;
            case BOUNDARY_STATUS.NEEDS_REVISIONS:
                return canWrite ? 'Revise boundary' : null;
            default:
                return null;
        }
    };

    const goToDrawPage = () => navigate(`/draw/${boundary.id}`);

    const getDrawButtonOnClick = () => {
        if (canReview && boundary.status === BOUNDARY_STATUS.SUBMITTED) {
            return startReview(boundary.id).unwrap().then(goToDrawPage);
        }

        return goToDrawPage;
    };

    const drawButtonText = getDrawButtonText() || 'View boundary';
    const drawButtonOnClick = getDrawButtonOnClick();

    return (
        <Box position='absolute' zIndex={1000} top={22} w='100%'>
            <Flex justify='space-evenly'>
                {drawButtonText ? (
                    <MapButton icon={ChatAltIcon} onClick={drawButtonOnClick}>
                        {drawButtonText}
                    </MapButton>
                ) : null}
                <MapButton icon={MailIcon}>
                    <a
                        href={`mailto:${boundary.submission.primary_contact.email}`}
                        style={{ color: 'inherit' }}
                    >
                        Email
                    </a>
                </MapButton>
                <MapButton
                    icon={DownloadIcon}
                    onClick={() =>
                        downloadData(
                            JSON.stringify(boundary.submission.shape),
                            getBoundaryShapeFilename(boundary)
                        )
                    }
                >
                    Download
                </MapButton>
            </Flex>
        </Box>
    );
}

function MapButton({ icon, children, onClick }) {
    return (
        <Button
            size='lg'
            variant='mapButton'
            boxShadow='lg'
            rightIcon={<Icon as={icon} />}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

function useSubmissionStatusBar(boundary) {
    const role = useSelector(state => state.auth.user.role);

    if (role !== ROLES.CONTRIBUTOR) {
        return null;
    }

    const getDetailText = () => {
        switch (boundary.status) {
            case BOUNDARY_STATUS.SUBMITTED:
                return 'Your map will be reviewed.';
            case BOUNDARY_STATUS.IN_REVIEW:
                return 'Your map is being reviewed.';
            case BOUNDARY_STATUS.NEEDS_REVISIONS:
                return getReviewDetailText(boundary.submission.review);
            case BOUNDARY_STATUS.APPROVED:
                return 'Your map has been approved and added to the system.';
            default:
                return null;
        }
    };

    const getReviewDetailText = review => {
        const commentCount = review.annotations.length;

        if (commentCount === 1) {
            return 'There is one comment on your map.';
        }

        if (commentCount > 1) {
            return `There are ${commentCount} comments on your map.`;
        }

        return 'Your map have been reviewed and needs revisions.';
    };

    const getBarColor = () => {
        switch (boundary.status) {
            case BOUNDARY_STATUS.SUBMITTED:
                return 'teal';
            case BOUNDARY_STATUS.IN_REVIEW:
            case BOUNDARY_STATUS.NEEDS_REVISIONS:
                return 'orange';
            case BOUNDARY_STATUS.APPROVED:
                return 'green';
            default:
                return null;
        }
    };

    const detailText = getDetailText();
    const barColor = getBarColor();

    if (!detailText) {
        return null;
    }

    return (
        <Box h={12} bg={`${barColor}.50`} w='100%' borderRadius={6}>
            <HStack p={3}>
                <Icon
                    as={ExclamationCircleIcon}
                    color={`${barColor}.400`}
                    boxSize={6}
                ></Icon>
                <Text textStyle='detail'>{detailText}</Text>
            </HStack>
        </Box>
    );
}

function Polygon({ shape }) {
    useMapLayer(L.geoJSON(shape, POLYGON_LAYER_OPTIONS), {
        fitBounds: true,
    });
}
