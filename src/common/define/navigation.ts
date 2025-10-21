
// output: "export" 에서는 동적 파라미터가 불가능하기 때문에
// 허용할 segment 목록을 미리 지정해야 함

export const Sections:string[]= ["front","back", "db", "ai", "infra", "oss"] as const;
export const ALLOWED_SEGMENTS_front:string[] = ["core", "module", "ui", "buildTools","react","next"] as const;

export const navigation = Sections.map(index => {

    if (index === "front") {
        return {
            children: ALLOWED_SEGMENTS_front.map(seg => ({ path :`/front/${seg}`, name: seg, key : seg, active: true}))
        }
    } 
    return {
        children: []
    }
})

    
