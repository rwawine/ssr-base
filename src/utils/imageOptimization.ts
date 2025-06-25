export const IMAGE_SIZES = {
    desktop: 1920,
    tablet: 1024,
    mobile: 768
};

export const optimizeImageUrl = (url: string, width: number) => {
    if (!url) return '';
    return url.replace('/upload/', `/upload/w_${width},c_scale,f_auto,q_auto,dpr_auto,fl_progressive/`);
};

export const getOptimizedImageUrl = (imageData: any, size: keyof typeof IMAGE_SIZES = 'desktop') => {
    const imageUrl = imageData?.formats?.large?.url ||
        imageData?.formats?.medium?.url ||
        imageData?.url || '';
    return imageUrl ? optimizeImageUrl(imageUrl, IMAGE_SIZES[size]) : '';
}; 