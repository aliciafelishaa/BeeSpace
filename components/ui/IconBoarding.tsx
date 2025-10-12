import React from 'react'
import Svg, { Rect, Mask, G, Path, Ellipse, Circle } from 'react-native-svg'

export default function IconBoarding() {
    return (
        <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <Rect width={32} height={32} rx={8} fill="#2B2923" />
            <Mask id="mask0" maskUnits="userSpaceOnUse" x={0} y={0} width={32} height={32}>
                <Rect width={32} height={32} rx={8} fill="#1D1C1A" />
            </Mask>
            <G mask="url(#mask0)">
                <Path
                    d="M24.6139 16.9591C38.1511 15.0804 49.5389 16.5482 50.0492 20.2375C50.5595 23.9269 39.9991 28.4407 26.4619 30.3194C12.9246 32.1981 1.53685 30.7303 1.02652 27.0409C0.516203 23.3516 11.0766 18.8378 24.6139 16.9591ZM25.1158 18.5995C13.0677 20.2715 3.61053 23.8666 3.99268 26.6293C4.37483 29.392 14.4516 30.2762 26.4997 28.6041C38.5478 26.9321 48.005 23.337 47.6228 20.5743C47.2407 17.8116 37.164 16.9274 25.1158 18.5995Z"
                    fill="#665330"
                />
                <Path d="M33.6832 31.462C33.5742 32.3791 32.5722 32.9129 31.7502 32.4919C30.7971 32.0037 30.7859 30.6306 31.731 30.127C32.6762 29.6235 33.8096 30.3986 33.6832 31.462Z" fill="#FCBC03" />
                <Ellipse cx={24.8523} cy={21.607} rx={13.2373} ry={11.1984} fill="#FCBC03" />
                <Ellipse cx={18.3161} cy={12.0151} rx={4.66286} ry={4.40381} fill="#FCBC03" />
                <Circle cx={18.3239} cy={11.9991} r={3.38998} fill="white" />
                <Ellipse cx={18.2934} cy={12.0531} rx={2.61333} ry={2.66667} fill="#262626" />
                <Ellipse cx={27.1694} cy={10.6973} rx={4.66286} ry={4.40381} fill="#FCBC03" />
                <Circle cx={27.1772} cy={10.681} r={3.38998} fill="white" />
                <Circle cx={27.2725} cy={10.7109} r={2.66667} fill="#262626" />
            </G>
        </Svg>
    )
}
