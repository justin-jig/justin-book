
// output: "export" 에서는 동적 파라미터가 불가능하기 때문에
// 허용할 segment 목록을 미리 지정해야 함

export const Sections = ["front","back","infra"] as const;
export const ALLOWED_SEGMENTS_front:string[] = ["ui","builder","core","module","react"] as const;

export const navigation = [
    {
        children: ALLOWED_SEGMENTS_front.map(seg => (
            { path :`/front/${seg}`, name: seg, key : seg, active: true}
        )),
    },
    // {
    //     children: [
    //         { path :'/back/java', name: "Java", key : 'java' , active: true},
    //         { path :'/back/python', name: "Python", key : 'python'},
    //         { path :'/back/node', name: "Node", key : 'node' , active: true},
    //         { path :'/back/nest', name: "Nest", key : 'nest', active: true},
    //     ]
    // },
    //  {
    //     children: [
    //         { path :'/infra/nginx', name: "Nginx", key : 'nginx' , active: true},
    //         { path :'/infra/docker', name: "Docker", key : 'docker'},
    //         { path :'/infra/kubernetes', name: "Kubernetes", key : 'kubernetes' , active: true},
    //         { path :'/infra/redis', name: "Reids", key : 'redis', active: true},
    //     ]
    // }
];      