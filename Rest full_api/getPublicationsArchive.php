<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

//include "../includes/functions.php";
include "includes/db.php";
require_once( "Objects/FunctionClass.php");

$id = isset($_GET['id']) ? $_GET['id'] : "";
$month = isset($_GET['month']) ? $_GET['month'] : "";

$username = isset($_GET['username']) ? $_GET['username'] : "";
$password = isset($_GET['password']) ? $_GET['password'] : "";


$date = date("Y-m%",strtotime("-".$month." month"));
//echo $date;

$json = array();



try {
	
	$functionObject = new FunctionClass('./');
	$member_id = $functionObject->getIdMembre($username, $password);
	$abonnementArray = $functionObject->getJournauxForCurrentAbonnement($member_id);
	
	$STH = $DBH->prepare("
	SELECT editions.id, editions.id_journal, editions.datePublication, editions.downloadPath, editions.imagePath, editions.quantite, 
	journal.nom, journal.type, journal.categorie, subscription.until
	FROM editions 
	LEFT JOIN journal ON journal.id = editions.id_journal 
	LEFT JOIN subscription ON journal.id = subscription.journal_id AND until > NOW() AND member_id = '".(int)$member_id."'
	WHERE editions.id_journal = :id 
	AND editions.visible = 1 
	AND editions.datePublication LIKE :date 
	ORDER BY datePublication ASC
	");
	
	
	$STH->bindParam(":id", $id);
	$STH->bindParam(":date", $date);
	$STH->execute();
	$STH->setFetchMode(PDO::FETCH_ASSOC);  
	
	
	$x = 0;
	while($row = $STH->fetch()) {  
		//print_r($row);
		
		$temp_journal = array();
		
		$temp_journal['id'] = $row['id'];
		$temp_journal['id_journal'] = $row['id_journal'];
		$temp_journal['nom'] = $row['nom'];
		$temp_journal['type'] = $row['type'];
		$temp_journal['categorie'] = $row['categorie'];
		$temp_journal['datePublication'] = $row['datePublication'];
		$temp_journal['downloadPath'] = $row['downloadPath'];
		$temp_journal['coverPath'] = $row['imagePath'];
		$temp_journal['prix'] = $row['quantite'];
		$temp_journal['isSubscription'] = $row['until'] ? 1 : 0;
		
		$temp_journal['telechargementRestant'] = $functionObject->getNbTelechargementIssueForAchat($member_id, $row['id']);
		/*
		$bought_id = $functionObject->getBoughtIssueMembre($member_id, $row['id']);
		if($bought_id != NULL) {
			$temp_journal['bought'] = 1;
		}
		else {
			$temp_journal['bought'] = verifProductForAbonnement($row, $abonnementArray);
		}
		*/
		
		$json[$x] = $temp_journal;
		
		++$x;
	}  
	//print_r($json);
	//echo json_encode($json);
	echo json_encode(array("resultat" => "true", "data" => $json));
}
catch(PDOException $e) {
	//echo $e->getMessage();
	echo json_encode(array("resultat" => "false", "data" => $e->getMessage()));
}


// a déplacer dans un fichier de fonction
function verifProductForAbonnement($productArray, $abonnementArray) {
	$productDate = date('Y-m-d', strtotime($productArray['datePublication']));
	$journauxId = $productArray['id_journal'];
	
	$journauxArray = $abonnementArray['journaux'];
	$dateArray = $abonnementArray['date'];
    
	for($x = 0; $x < count($journauxArray); ++$x) {
		if($journauxId == $journauxArray[$x]) {
			for($y = 0; $y < count($dateArray); ++$y) {
				
				$dateBegin = date('Y-m-d', strtotime($dateArray[$y]['date_achat']));
			    $dateEnd = date('Y-m-d', strtotime($dateArray[$y]['date_fin']));
				
				if (($productDate >= $dateBegin) && ($productDate <= $dateEnd)) {
					return 1;
				}
				
			}
		}
	}
	
	return 0;	
}
?>
