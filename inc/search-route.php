<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch(){
    register_rest_route('university/v1','search',array(
        'methods' => WP_REST_SERVER::READABLE,//HTTP GET method. Indicates that the registered route is intended for fetching data
        'callback' => 'universitySearchResult'
    ));
}
function universitySearchResult($data){
    $query = new WP_Query(array(
        'post_type' => array('professor','page','post','event','program'),
        's'=> sanitize_text_field($data['term'])
    ));
    $results = array(
        'page'=>array(),
        'blog'=>array(),
        'program'=>array(),
        'event'=>array(),
        'professor'=>array(),
    );
    while($query->have_posts()){
        $query->the_post();
       
        if(get_post_type() == 'post'){
            array_push($results['blog'],array(
                'id' => get_the_id(),
                'title'=>get_the_title(),
                'link'=>get_the_permalink(),
                'author'=>get_the_author()
            ));
        }
        if(get_post_type() == 'page'){
            array_push($results['page'],array(
                'id' => get_the_id(),
                'title'=>get_the_title(),
                'link'=>get_the_permalink(),
            ));
        }
        if(get_post_type() == 'event'){
            $eventDate = new DateTime(get_field('event_date'));
            array_push($results['event'],array(
                'id' => get_the_id(),
                'title'=>get_the_title(),
                'link'=>get_the_permalink(),
                'month'=> $eventDate->format('M'),
                'date'=> $eventDate->format('d')
            ));
        }
        if(get_post_type() == 'professor'){
            array_push($results['professor'],array(
                'id' => get_the_id(),
                'title'=>get_the_title(),
                'link'=>get_the_permalink(),
                'image'=>get_the_post_thumbnail_url(0,'professorLandscape'),
            ));
            if(get_field('related_program')){
                foreach( get_field('related_program') as $related_program ): 
                    array_push($results['program'],array(
                        'title'=>get_the_title($related_program->ID ),
                        'link'=>get_the_permalink($related_program->ID ),
                        'id' => get_the_id($related_program->ID )
                    ));
                endforeach;
            }
        }
        if(get_post_type() == 'program'){
            array_push($results['program'],array(
                'title'=>get_the_title(),
                'link'=>get_the_permalink(),
                'id' => get_the_id()
            ));
        }
       
    }


    if ($results['program']) {
        $programsMetaQuery = array('relation' => 'OR');
    
        foreach($results['program'] as $item) {
          array_push($programsMetaQuery, array(
              'key' => 'related_program',
              'compare' => 'LIKE',
              'value' => '"' . $item['id'] . '"'
            ));
        }
    
        $programRelationshipQuery = new WP_Query(array(
          'post_type' => array('professor','event'),
          'meta_query' => $programsMetaQuery
        ));
    
        while($programRelationshipQuery->have_posts()) {
          $programRelationshipQuery->the_post();
    
            if (get_post_type() == 'professor') {
                array_push($results['professor'], array(
                'id' => get_the_id(),
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
                ));
            }
          
            if(get_post_type() == 'event'){
                $eventDate = new DateTime(get_field('event_date'));
                array_push($results['event'],array(
                    'id' => get_the_id(),
                    'title'=>get_the_title(),
                    'link'=>get_the_permalink(),
                    'month'=> $eventDate->format('M'),
                    'date'=> $eventDate->format('d')
                ));
            }
        }
      }
    
    // Compare specific properties of your objects or elements
    function customCompare($a, $b) {
        return $a['id'] <=> $b['id'];
    }
    
    $results['professor'] = array_values(array_unique($results['professor'], SORT_REGULAR));
    $results['event'] = array_values(array_unique($results['event'], SORT_REGULAR));
    $results['program'] = array_values(array_unique($results['program'], SORT_REGULAR));
    return $results;
}